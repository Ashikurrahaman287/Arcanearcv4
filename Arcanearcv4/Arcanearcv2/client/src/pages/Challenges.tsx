import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Target, CheckCircle2, Circle, Calendar } from "lucide-react";
import { Challenge, UserChallenge, Week } from "@shared/schema";

interface ChallengeWithStatus extends Challenge {
  userChallenge?: UserChallenge;
  week: Week;
}

export default function Challenges() {
  const { toast } = useToast();

  const { data: challenges, isLoading } = useQuery<ChallengeWithStatus[]>({
    queryKey: ["/api/challenges/user"],
  });

  const toggleMutation = useMutation({
    mutationFn: async (challengeId: string) => {
      return await apiRequest("POST", `/api/challenges/${challengeId}/toggle`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/challenges/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      toast({
        title: "Challenge updated!",
        description: "Your progress has been saved.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update challenge",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 space-y-6">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  const activeChallenges = challenges?.filter(c => !c.userChallenge?.completed) || [];
  const completedChallenges = challenges?.filter(c => c.userChallenge?.completed) || [];

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2" data-testid="text-challenges-title">
          Challenges
        </h1>
        <p className="text-lg text-muted-foreground">
          Complete challenges to build momentum and earn achievements
        </p>
      </div>

      {/* Active Challenges */}
      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Target className="h-6 w-6 text-primary" />
          Active Challenges
        </h2>

        {activeChallenges.length > 0 ? (
          <div className="space-y-4">
            {activeChallenges.map((challenge) => (
              <Card key={challenge.id} className="hover-elevate transition-all shadow-md" data-testid={`card-challenge-${challenge.id}`}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Checkbox
                      checked={false}
                      onCheckedChange={() => toggleMutation.mutate(challenge.id)}
                      className="mt-1"
                      data-testid={`checkbox-challenge-${challenge.id}`}
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-semibold">{challenge.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
                              Week {challenge.week.weekNumber}
                            </span>
                            <span className="text-xs px-2 py-1 rounded-full bg-muted capitalize">
                              {challenge.type}
                            </span>
                          </div>
                        </div>
                        <Circle className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <p className="text-muted-foreground">{challenge.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No active challenges. Check back soon for new ones!</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Completed Challenges */}
      {completedChallenges.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <CheckCircle2 className="h-6 w-6 text-chart-1" />
            Completed Challenges
          </h2>

          <div className="space-y-4">
            {completedChallenges.map((challenge) => (
              <Card key={challenge.id} className="opacity-75" data-testid={`card-completed-${challenge.id}`}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Checkbox
                      checked={true}
                      onCheckedChange={() => toggleMutation.mutate(challenge.id)}
                      className="mt-1"
                      data-testid={`checkbox-completed-${challenge.id}`}
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-semibold line-through">{challenge.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
                              Week {challenge.week.weekNumber}
                            </span>
                            <span className="text-xs px-2 py-1 rounded-full bg-muted capitalize">
                              {challenge.type}
                            </span>
                          </div>
                        </div>
                        <CheckCircle2 className="h-5 w-5 text-chart-1" />
                      </div>
                      <p className="text-muted-foreground">{challenge.description}</p>
                      {challenge.userChallenge?.completedAt && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Completed on {new Date(challenge.userChallenge.completedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
