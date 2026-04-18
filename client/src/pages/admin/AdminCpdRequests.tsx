/**
 * Admin CPD Requests Page
 * Lists all CPD presentation requests with status management
 */
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { GraduationCap, Mail, Phone, Building2, User, Calendar, Users, Loader2, CreditCard, CheckCircle2 } from "lucide-react";

const PAYMENT_COLORS: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  completed: "bg-green-500/20 text-green-400 border-green-500/30",
  failed: "bg-red-500/20 text-red-400 border-red-500/30",
};

const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  contacted: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  confirmed: "bg-green-500/20 text-green-400 border-green-500/30",
  completed: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
};

export default function AdminCpdRequests() {
  const { data: requests, isLoading, refetch } = trpc.admin.cpdRequests.useQuery();
  const [filter, setFilter] = useState<string>("all");

  const updateStatus = trpc.admin.updateCpdStatus.useMutation({
    onSuccess: () => {
      toast.success("Status updated");
      refetch();
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update status");
    },
  });

  const filtered = requests?.filter((r: any) => filter === "all" || r.status === filter) || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-primary" />
            CPD Requests
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {requests?.length || 0} total request{requests?.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="contacted">Contacted</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <GraduationCap className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No CPD requests {filter !== "all" ? `with status "${filter}"` : "yet"}.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filtered.map((req: any) => (
            <Card key={req.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-muted-foreground" />
                      {req.companyName}
                    </CardTitle>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5" /> {req.contactName}
                      </span>
                      {req.jobTitle && <span>({req.jobTitle})</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {req.paymentStatus && (
                      <Badge className={PAYMENT_COLORS[req.paymentStatus] || ""} variant="outline">
                        <CreditCard className="w-3 h-3 mr-1" />
                        {req.paymentStatus === "completed" ? "Paid £19.99" : req.paymentStatus}
                      </Badge>
                    )}
                    <Badge className={STATUS_COLORS[req.status] || ""} variant="outline">
                      {req.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-3 text-sm mb-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <a href={`mailto:${req.email}`} className="text-primary hover:underline">
                      {req.email}
                    </a>
                  </div>
                  {req.phone && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="w-4 h-4" />
                      <a href={`tel:${req.phone}`} className="text-primary hover:underline">
                        {req.phone}
                      </a>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    {req.preferredDate || "Flexible"}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="w-4 h-4" />
                    {req.attendees || "Not specified"} attendees
                  </div>
                </div>

                <div className="text-sm mb-4">
                  <span className="text-muted-foreground">Format:</span>{" "}
                  <span className="capitalize">{req.format}</span>
                </div>

                {req.additionalNotes && (
                  <div className="text-sm mb-4 bg-muted/50 rounded p-3">
                    <span className="text-muted-foreground font-medium">Notes:</span>{" "}
                    {req.additionalNotes}
                  </div>
                )}

                <div className="flex items-center gap-3 pt-2 border-t border-border">
                  <span className="text-xs text-muted-foreground">Update status:</span>
                  {(["new", "contacted", "confirmed", "completed", "cancelled"] as const).map(
                    (status) => (
                      <Button
                        key={status}
                        size="sm"
                        variant={req.status === status ? "default" : "outline"}
                        className="text-xs capitalize h-7"
                        disabled={req.status === status || updateStatus.isPending}
                        onClick={() => updateStatus.mutate({ id: req.id, status })}
                      >
                        {status}
                      </Button>
                    )
                  )}
                </div>

                <p className="text-xs text-muted-foreground mt-3">
                  Submitted: {new Date(req.createdAt).toLocaleString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
