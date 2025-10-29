import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  BookOpen,
  Target,
  Library,
  User,
  Trophy,
  LogOut,
  Snowflake,
  BarChart3,
  Users,
  MessageSquare,
  Settings,
  Mail,
  ClipboardList,
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { getAuthState, clearAuthState, isAdmin } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

export function AppSidebar() {
  const [location, setLocation] = useLocation();
  const { user } = getAuthState();
  const { toast } = useToast();

  const handleLogout = () => {
    clearAuthState();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    setLocation("/");
  };

  const userMenuItems = [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { title: "Journal", url: "/dashboard/journal", icon: BookOpen },
    { title: "Challenges", url: "/dashboard/challenges", icon: Target },
    { title: "Learning Hub", url: "/dashboard/learning", icon: Library },
    { title: "Profile", url: "/dashboard/profile", icon: User },
  ];

  const adminMenuItems = [
    { title: "Admin Dashboard", url: "/admin", icon: BarChart3 },
    { title: "Users", url: "/admin/users", icon: Users },
    { title: "Messages", url: "/admin/messages", icon: Mail },
    { title: "Tasks", url: "/admin/tasks", icon: ClipboardList },
    { title: "Challenges", url: "/admin/challenges", icon: Target },
    { title: "Announcements", url: "/admin/announcements", icon: MessageSquare },
    { title: "Resources", url: "/admin/resources", icon: Library },
    { title: "Settings", url: "/admin/settings", icon: Settings },
  ];

  const menuItems = isAdmin(user) ? adminMenuItems : userMenuItems;

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <Link href={isAdmin(user) ? "/admin" : "/dashboard"}>
          <a className="flex items-center gap-2 hover-elevate rounded-lg px-2 py-1 -ml-2">
            <Snowflake className="h-6 w-6 text-primary" />
            <span className="font-serif text-lg font-bold">Arcane Arc</span>
          </a>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{isAdmin(user) ? "Admin" : "Navigation"}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location === item.url || location.startsWith(item.url + "/");
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={item.url}>
                        <a data-testid={`link-sidebar-${item.title.toLowerCase().replace(/\s+/g, "-")}`}>
                          <Icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </a>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        <div className="space-y-3">
          {user && (
            <div className="flex items-center gap-3 px-2 py-1">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-xs font-semibold text-primary">
                  {user.fullName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{user.fullName}</div>
                <div className="text-xs text-sidebar-foreground/70 truncate">@{user.username}</div>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-2 py-2 rounded-lg text-sm font-medium text-sidebar-foreground hover-elevate active-elevate-2"
            data-testid="button-logout"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
