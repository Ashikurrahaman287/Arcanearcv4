import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, BookOpen, Target, TrendingUp, BarChart3 } from "lucide-react";

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalJournals: number;
  totalChallenges: number;
  averageProgress: number;
  recentActivity: {
    date: string;
    journals: number;
    signups: number;
  }[];
}

export default function AdminDashboard() {
  const { data: stats, isLoading } = useQuery<AdminStats>({
    queryKey: ["/api/admin/stats"],
  });

  if (isLoading || !stats) {
    return (
      <div className="p-6 md:p-8 space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2" data-testid="text-admin-title">
          Admin Dashboard
        </h1>
        <p className="text-lg text-muted-foreground">
          Overview of program metrics and user activity
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-md hover-elevate transition-all" data-testid="card-total-users">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Users</p>
                <p className="text-3xl font-bold">{stats.totalUsers}</p>
              </div>
              <div className="p-3 rounded-xl bg-primary/10">
                <Users className="h-8 w-8 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md hover-elevate transition-all" data-testid="card-active-users">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Active This Week</p>
                <p className="text-3xl font-bold">{stats.activeUsers}</p>
              </div>
              <div className="p-3 rounded-xl bg-chart-1/10">
                <TrendingUp className="h-8 w-8 text-chart-1" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md hover-elevate transition-all" data-testid="card-journals">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Journals</p>
                <p className="text-3xl font-bold">{stats.totalJournals}</p>
              </div>
              <div className="p-3 rounded-xl bg-chart-2/10">
                <BookOpen className="h-8 w-8 text-chart-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md hover-elevate transition-all" data-testid="card-avg-progress">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Avg Progress</p>
                <p className="text-3xl font-bold">{Math.round(stats.averageProgress)}%</p>
              </div>
              <div className="p-3 rounded-xl bg-chart-3/10">
                <BarChart3 className="h-8 w-8 text-chart-3" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Recent Activity (Last 7 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                <div>
                  <p className="font-medium">{new Date(activity.date).toLocaleDateString()}</p>
                  <p className="text-sm text-muted-foreground">
                    {activity.journals} journals, {activity.signups} new signups
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
