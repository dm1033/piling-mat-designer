import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";
import { Search, FileText, Eye } from "lucide-react";
import { Link } from "wouter";

export default function AdminDesigns() {
  const { data: designs, isLoading } = trpc.admin.designs.useQuery();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "completed" | "pending">("all");

  const filtered = useMemo(() => {
    if (!designs) return [];
    let list = designs;

    if (statusFilter !== "all") {
      list = list.filter((d) => d.paymentStatus === statusFilter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (d) =>
          d.certificateRef?.toLowerCase().includes(q) ||
          d.projectName?.toLowerCase().includes(q) ||
          d.clientName?.toLowerCase().includes(q) ||
          d.siteLocation?.toLowerCase().includes(q) ||
          d.userName?.toLowerCase().includes(q) ||
          d.userEmail?.toLowerCase().includes(q)
      );
    }

    return list;
  }, [designs, search, statusFilter]);

  const formatDate = (d: Date | string | null) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (pence: number) => `£${(pence / 100).toFixed(2)}`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold tracking-tight">Design Certificates</h1>
        <p className="text-muted-foreground mt-1">
          All purchased BRE470 design certificates and their status
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <CardTitle className="text-lg font-heading flex items-center gap-2">
                <FileText className="w-5 h-5" />
                {isLoading
                  ? "Loading..."
                  : `${filtered.length} design${filtered.length !== 1 ? "s" : ""}`}
              </CardTitle>
              <div className="relative max-w-xs w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search ref, project, client, user..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="flex gap-2">
              {(["all", "completed", "pending"] as const).map((s) => (
                <Button
                  key={s}
                  variant={statusFilter === s ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter(s)}
                  className="capitalize"
                >
                  {s === "all" ? "All" : s}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              {search || statusFilter !== "all"
                ? "No designs match your filters."
                : "No designs created yet."}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Certificate Ref</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Certificate</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((design) => (
                    <TableRow key={design.id}>
                      <TableCell className="font-mono text-xs font-medium">
                        {design.certificateRef}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {design.projectName || "—"}
                      </TableCell>
                      <TableCell className="text-sm">
                        {design.clientName || "—"}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">{design.userName || "—"}</div>
                          <div className="text-xs text-muted-foreground">
                            {design.userEmail || "—"}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatPrice(design.amountPence)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            design.paymentStatus === "completed"
                              ? "default"
                              : "secondary"
                          }
                          className={
                            design.paymentStatus === "completed"
                              ? "bg-green-100 text-green-800 hover:bg-green-100"
                              : "bg-amber-100 text-amber-800 hover:bg-amber-100"
                          }
                        >
                          {design.paymentStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {design.certificateIssued ? (
                          <Badge
                            variant="default"
                            className="bg-blue-100 text-blue-800 hover:bg-blue-100"
                          >
                            Issued
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(design.createdAt)}
                      </TableCell>
                      <TableCell>
                        {design.paymentStatus === "completed" && (
                          <Link href={`/admin/designs/${design.id}`}>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
