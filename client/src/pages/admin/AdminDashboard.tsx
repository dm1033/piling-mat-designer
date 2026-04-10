import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, PoundSterling, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDashboard() {
  const { data: stats, isLoading } = trpc.admin.stats.useQuery();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-heading font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Overview of BRE470 Piling Mat Designer activity
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="Total Users"
          value={stats?.totalUsers}
          icon={<Users className="w-5 h-5" />}
          loading={isLoading}
        />
        <StatCard
          title="Total Revenue"
          value={stats?.totalRevenueFormatted}
          icon={<PoundSterling className="w-5 h-5" />}
          loading={isLoading}
          highlight
        />
        <StatCard
          title="Total Designs"
          value={stats?.totalDesigns}
          icon={<FileText className="w-5 h-5" />}
          loading={isLoading}
        />
        <StatCard
          title="Paid Certificates"
          value={stats?.paidDesigns}
          icon={<CheckCircle2 className="w-5 h-5" />}
          loading={isLoading}
          variant="success"
        />
        <StatCard
          title="Pending Payments"
          value={stats?.pendingDesigns}
          icon={<Clock className="w-5 h-5" />}
          loading={isLoading}
          variant="warning"
        />
        <StatCard
          title="Conversion Rate"
          value={
            stats && stats.totalDesigns > 0
              ? `${Math.round((stats.paidDesigns / stats.totalDesigns) * 100)}%`
              : "—"
          }
          icon={<AlertCircle className="w-5 h-5" />}
          loading={isLoading}
        />
      </div>

      {/* Quick Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-heading">Product Info</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Product:</span>{" "}
              <span className="font-medium">BRE470 Working Platform Design & Certificate</span>
            </div>
            <div>
              <span className="text-muted-foreground">Price:</span>{" "}
              <span className="font-medium">£299.99 per design</span>
            </div>
            <div>
              <span className="text-muted-foreground">Certificate Signer:</span>{" "}
              <span className="font-medium">David Miller, Temporary Works Designer</span>
            </div>
            <div>
              <span className="text-muted-foreground">Standard:</span>{" "}
              <span className="font-medium">BR 470 (BRE 2004)</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  loading,
  highlight,
  variant,
}: {
  title: string;
  value?: string | number;
  icon: React.ReactNode;
  loading: boolean;
  highlight?: boolean;
  variant?: "success" | "warning";
}) {
  const borderClass =
    variant === "success"
      ? "border-l-4 border-l-green-500"
      : variant === "warning"
        ? "border-l-4 border-l-amber-500"
        : highlight
          ? "border-l-4 border-l-primary"
          : "";

  return (
    <Card className={borderClass}>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">{title}</span>
          <div className="text-muted-foreground">{icon}</div>
        </div>
        {loading ? (
          <Skeleton className="h-8 w-24" />
        ) : (
          <p className="text-2xl font-heading font-bold">{value ?? "—"}</p>
        )}
      </CardContent>
    </Card>
  );
}
