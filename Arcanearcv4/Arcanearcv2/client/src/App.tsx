import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/Landing";
import About from "@/pages/About";
import Program from "@/pages/Program";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Dashboard from "@/pages/Dashboard";
import Journal from "@/pages/Journal";
import Challenges from "@/pages/Challenges";
import Learning from "@/pages/Learning";
import Profile from "@/pages/Profile";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminUsers from "@/pages/AdminUsers";
import AdminMessages from "@/pages/AdminMessages";
import AdminTasks from "@/pages/AdminTasks";
import AdminChallenges from "@/pages/AdminChallenges";
import AdminAnnouncements from "@/pages/AdminAnnouncements";
import AdminResources from "@/pages/AdminResources";
import AdminLogin from "@/pages/AdminLogin";

function PublicRouter() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/about" component={About} />
      <Route path="/program" component={Program} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route component={NotFound} />
    </Switch>
  );
}

function DashboardRouter() {
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center justify-between p-4 border-b border-border bg-background">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <ThemeToggle />
          </header>
          <main className="flex-1 overflow-y-auto bg-background">
            <Switch>
              <Route path="/dashboard">
                {() => (
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                )}
              </Route>
              <Route path="/dashboard/journal">
                {() => (
                  <ProtectedRoute>
                    <Journal />
                  </ProtectedRoute>
                )}
              </Route>
              <Route path="/dashboard/challenges">
                {() => (
                  <ProtectedRoute>
                    <Challenges />
                  </ProtectedRoute>
                )}
              </Route>
              <Route path="/dashboard/learning">
                {() => (
                  <ProtectedRoute>
                    <Learning />
                  </ProtectedRoute>
                )}
              </Route>
              <Route path="/dashboard/profile">
                {() => (
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                )}
              </Route>
              <Route path="/admin">
                {() => (
                  <ProtectedRoute requireAdmin>
                    <AdminDashboard />
                  </ProtectedRoute>
                )}
              </Route>
              <Route path="/admin/users">
                {() => (
                  <ProtectedRoute requireAdmin>
                    <AdminUsers />
                  </ProtectedRoute>
                )}
              </Route>
              <Route path="/admin/messages">
                {() => (
                  <ProtectedRoute requireAdmin>
                    <AdminMessages />
                  </ProtectedRoute>
                )}
              </Route>
              <Route path="/admin/tasks">
                {() => (
                  <ProtectedRoute requireAdmin>
                    <AdminTasks />
                  </ProtectedRoute>
                )}
              </Route>
              <Route path="/admin/challenges">
                {() => (
                  <ProtectedRoute requireAdmin>
                    <AdminChallenges />
                  </ProtectedRoute>
                )}
              </Route>
              <Route path="/admin/announcements">
                {() => (
                  <ProtectedRoute requireAdmin>
                    <AdminAnnouncements />
                  </ProtectedRoute>
                )}
              </Route>
              <Route path="/admin/resources">
                {() => (
                  <ProtectedRoute requireAdmin>
                    <AdminResources />
                  </ProtectedRoute>
                )}
              </Route>
              <Route component={NotFound} />
            </Switch>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Switch>
          <Route path="/admin/login" component={AdminLogin} />
          <Route path="/dashboard" nest>
            {() => <DashboardRouter />}
          </Route>
          <Route path="/admin" nest>
            {() => <DashboardRouter />}
          </Route>
          <Route>
            {() => <PublicRouter />}
          </Route>
        </Switch>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
