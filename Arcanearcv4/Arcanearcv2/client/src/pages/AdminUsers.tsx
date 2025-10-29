import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Users, Search, Calendar, Trophy } from "lucide-react";
import { User } from "@shared/schema";

export default function AdminUsers() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: users, isLoading } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
  });

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 space-y-6">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  const filteredUsers = users?.filter(user =>
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2" data-testid="text-users-title">
          User Management
        </h1>
        <p className="text-lg text-muted-foreground">
          View and manage all program members
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search users by name, username, or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 h-12"
          data-testid="input-search-users"
        />
      </div>

      {/* User List */}
      <div className="space-y-4">
        {filteredUsers.map((user) => (
          <Card key={user.id} className="hover-elevate transition-all shadow-md" data-testid={`card-user-${user.id}`}>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="font-semibold text-primary">
                    {user.fullName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
                  </span>
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-1">{user.fullName}</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    @{user.username} • {user.email}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="px-2 py-1">
                      <Users className="h-3 w-3 mr-1" />
                      {user.role}
                    </Badge>
                    <Badge variant="outline" className="px-2 py-1">
                      <Calendar className="h-3 w-3 mr-1" />
                      Week {user.currentWeek}
                    </Badge>
                    <Badge variant="outline" className="px-2 py-1">
                      <Trophy className="h-3 w-3 mr-1" />
                      {user.streak} day streak
                    </Badge>
                    <Badge variant="outline" className="px-2 py-1">
                      {user.totalJournals} journals
                    </Badge>
                  </div>
                </div>

                <div className="text-right text-sm text-muted-foreground">
                  Joined {new Date(user.createdAt).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No users found</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
