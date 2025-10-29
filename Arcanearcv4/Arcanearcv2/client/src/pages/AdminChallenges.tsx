import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Target, Plus } from "lucide-react";
import { Challenge, Week } from "@shared/schema";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ChallengeWithWeek extends Challenge {
  week: Week;
}

export default function AdminChallenges() {
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    weekId: "",
    title: "",
    description: "",
    type: "daily",
  });

  const { data: challenges, isLoading: challengesLoading } = useQuery<ChallengeWithWeek[]>({
    queryKey: ["/api/admin/challenges"],
  });

  const { data: weeks } = useQuery<Week[]>({
    queryKey: ["/api/weeks"],
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/admin/challenges", formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/challenges"] });
      toast({
        title: "Challenge created!",
        description: "The new challenge has been added to the program.",
      });
      setFormData({ weekId: "", title: "", description: "", type: "daily" });
      setShowForm(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create challenge",
        variant: "destructive",
      });
    },
  });

  if (challengesLoading) {
    return (
      <div className="p-6 md:p-8 space-y-6">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2" data-testid="text-challenges-admin-title">
            Challenge Management
          </h1>
          <p className="text-lg text-muted-foreground">
            Create and manage program challenges
          </p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="hover-elevate active-elevate-2"
          data-testid="button-create-challenge"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Challenge
        </Button>
      </div>

      {/* Create Form */}
      {showForm && (
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>New Challenge</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                createMutation.mutate();
              }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="weekId">Week</Label>
                <Select value={formData.weekId} onValueChange={(value) => setFormData({ ...formData, weekId: value })}>
                  <SelectTrigger id="weekId" className="h-12" data-testid="select-week">
                    <SelectValue placeholder="Select week" />
                  </SelectTrigger>
                  <SelectContent>
                    {weeks?.map((week) => (
                      <SelectItem key={week.id} value={week.id}>
                        Week {week.weekNumber} - {week.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Challenge Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter challenge title"
                  required
                  className="h-12"
                  data-testid="input-challenge-title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the challenge..."
                  required
                  className="min-h-24"
                  data-testid="input-challenge-description"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger id="type" className="h-12" data-testid="select-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button
                  type="submit"
                  className="flex-1 hover-elevate active-elevate-2"
                  disabled={createMutation.isPending}
                  data-testid="button-submit-challenge"
                >
                  {createMutation.isPending ? "Creating..." : "Create Challenge"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                  className="hover-elevate active-elevate-2"
                  data-testid="button-cancel-challenge"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Challenges List */}
      <div className="space-y-4">
        {challenges && challenges.length > 0 ? (
          challenges.map((challenge) => (
            <Card key={challenge.id} className="hover-elevate transition-all shadow-md" data-testid={`card-challenge-${challenge.id}`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
                        Week {challenge.week.weekNumber}
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full bg-muted capitalize">
                        {challenge.type}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{challenge.title}</h3>
                    <p className="text-muted-foreground">{challenge.description}</p>
                  </div>
                  <Target className="h-6 w-6 text-primary" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No challenges created yet</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
