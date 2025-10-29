import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { getAuthState } from "@/lib/auth";
import { Link } from "wouter";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  Flame,
  BookOpen,
  Target,
  Trophy,
  TrendingUp,
  Calendar,
  CheckCircle2,
  ArrowRight,
  Clock,
  Star,
  ClipboardList,
  Send,
} from "lucide-react";
import { User, Week, Journal, UserChallenge, Challenge, Announcement, Task, TaskSubmission } from "@shared/schema";

interface DashboardData {
  user: User;
  weeks: Week[];
  todayJournal: Journal | null;
  recentJournals: Journal[];
  activeChallenges: (UserChallenge & { challenge: Challenge })[];
  announcements: Announcement[];
}

interface TaskWithSubmission extends Task {
  submission?: TaskSubmission;
}

export default function Dashboard() {
  const { user } = getAuthState();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskWithSubmission | null>(null);
  const [submissionContent, setSubmissionContent] = useState("");

  const { data, isLoading } = useQuery<DashboardData>({
    queryKey: ["/api/dashboard"],
  });

  const { data: tasks, isLoading: tasksLoading } = useQuery<TaskWithSubmission[]>({
    queryKey: ["/api/tasks"],
  });

  const submitTaskMutation = useMutation({
    mutationFn: async (data: { taskId: string; content: string }) => {
      return await apiRequest("POST", `/api/tasks/${data.taskId}/submit`, { content: data.content });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Task submitted successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      setSubmitDialogOpen(false);
      setSubmissionContent("");
      setSelectedTask(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit task",
        variant: "destructive",
      });
    },
  });

  const handleSubmitTask = () => {
    if (!selectedTask || !submissionContent.trim()) {
      toast({
        title: "Error",
        description: "Please enter your submission content",
        variant: "destructive",
      });
      return;
    }
    submitTaskMutation.mutate({ taskId: selectedTask.id, content: submissionContent });
  };

  const openSubmitDialog = (task: TaskWithSubmission) => {
    setSelectedTask(task);
    setSubmissionContent("");
    setSubmitDialogOpen(true);
  };

  if (isLoading || !data) {
    return (
      <div className="p-6 md:p-8 space-y-6">
        <Skeleton className="h-24 w-full" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      </div>
    );
  }

  const currentWeek = data.weeks.find(w => w.weekNumber === user?.currentWeek);
  const progress = ((user?.currentWeek || 1) / 8) * 100;
  const daysInProgram = Math.ceil(
    (new Date().getTime() - new Date(user?.createdAt || Date.now()).getTime()) / (1000 * 60 * 60 * 24)
  );

  const getMotivationalMessage = () => {
    const streak = user?.streak || 0;
    const weekNumber = user?.currentWeek || 1;
    
    if (streak >= 30) {
      return "🔥 Incredible dedication! You're on fire!";
    } else if (streak >= 14) {
      return "💪 Two weeks strong! You're building powerful habits!";
    } else if (streak >= 7) {
      return "⭐ One week streak! You're on the right path!";
    } else if (weekNumber >= 6) {
      return "🎯 You're in the final stretch! Keep pushing forward!";
    } else if (weekNumber >= 4) {
      return "🌟 Halfway through your transformation journey!";
    } else if (data.todayJournal) {
      return "✨ Great job journaling today! Keep the momentum going!";
    } else {
      return "🚀 Ready to make today count? Let's do this!";
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2" data-testid="text-dashboard-welcome">
          Welcome back, {user?.fullName.split(" ")[0]}! 🌟
        </h1>
        <p className="text-lg text-muted-foreground mb-1">
          Day {daysInProgram} of your Arcane Arc journey
        </p>
        <p className="text-md font-medium text-primary" data-testid="text-motivational-message">
          {getMotivationalMessage()}
        </p>
      </div>

      {/* Overall Progress */}
      <Card className="shadow-md">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Your Transformation Progress</h3>
                <p className="text-sm text-muted-foreground">Week {user?.currentWeek} of 8</p>
              </div>
              <div className="text-3xl font-bold text-primary">{Math.round(progress)}%</div>
            </div>
            <Progress value={progress} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="hover-elevate transition-all shadow-md" data-testid="card-streak">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <Flame className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Current Streak</p>
                <p className="text-3xl font-bold">{user?.streak || 0} days</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-elevate transition-all shadow-md" data-testid="card-journals">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-chart-2/10">
                <BookOpen className="h-8 w-8 text-chart-2" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Journal Entries</p>
                <p className="text-3xl font-bold">{user?.totalJournals || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-elevate transition-all shadow-md" data-testid="card-tasks">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-chart-4/10">
                <ClipboardList className="h-8 w-8 text-chart-4" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tasks Completed</p>
                <p className="text-3xl font-bold">{tasks?.filter(t => t.submission?.rating).length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-elevate transition-all shadow-md" data-testid="card-progress">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-chart-5/10">
                <Trophy className="h-8 w-8 text-chart-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Week Progress</p>
                <p className="text-3xl font-bold">{user?.currentWeek || 1} / 8</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Challenge Progress */}
      {data.activeChallenges.length > 0 && (
        <Card className="shadow-md" data-testid="card-weekly-challenges">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-chart-3" />
              Weekly Challenge Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.activeChallenges.slice(0, 3).map((userChallenge) => {
                const completionPercentage = userChallenge.completed ? 100 : 0;
                return (
                  <div key={userChallenge.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{userChallenge.challenge.title}</span>
                      {userChallenge.completed ? (
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                      ) : (
                        <span className="text-xs text-muted-foreground">In Progress</span>
                      )}
                    </div>
                    <Progress value={completionPercentage} className="h-2" />
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {userChallenge.challenge.description}
                    </p>
                  </div>
                );
              })}
              {data.activeChallenges.length > 3 && (
                <Link href="/dashboard/challenges">
                  <Button variant="outline" className="w-full mt-2 hover-elevate active-elevate-2" size="sm">
                    View All Challenges ({data.activeChallenges.length})
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Journal Entries */}
      {data.recentJournals.length > 0 && (
        <Card className="shadow-md" data-testid="card-recent-journals">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-chart-2" />
              Recent Reflections
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.recentJournals.slice(0, 3).map((journal) => {
                const preview = journal.achievement || journal.gratitude || journal.challenge || journal.mood || "No content";
                return (
                  <div key={journal.id} className="border-l-2 border-primary/50 pl-4 py-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-muted-foreground">
                        {new Date(journal.createdAt).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                      <Star className="h-3 w-3 text-amber-500" />
                    </div>
                    <p className="text-sm line-clamp-2">{preview}</p>
                  </div>
                );
              })}
              <Link href="/dashboard/journal">
                <Button variant="outline" className="w-full mt-2 hover-elevate active-elevate-2" size="sm">
                  View All Entries
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Current Week */}
        {currentWeek && (
          <Card className="shadow-md" data-testid="card-current-week">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                This Week's Focus
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Week {currentWeek.weekNumber}</div>
                <h3 className="text-2xl font-serif font-bold">{currentWeek.title}</h3>
                <p className="text-muted-foreground mt-2">{currentWeek.description}</p>
              </div>
              <Link href="/dashboard/challenges">
                <Button className="w-full hover-elevate active-elevate-2" data-testid="button-view-challenges">
                  View Challenges
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Today's Reflection */}
        <Card className="shadow-md" data-testid="card-journal-prompt">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-chart-2" />
              Today's Reflection
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.todayJournal ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-primary">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="font-medium">Completed for today</span>
                </div>
                <p className="text-muted-foreground">
                  Great work! You've journaled today. Keep your streak going tomorrow.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-muted-foreground">
                  Take a moment to reflect on your day. What did you achieve? What challenged you? What are you grateful for?
                </p>
              </div>
            )}
            <Link href="/dashboard/journal">
              <Button
                variant={data.todayJournal ? "outline" : "default"}
                className="w-full hover-elevate active-elevate-2"
                data-testid="button-journal"
              >
                {data.todayJournal ? "View Journal" : "Write Reflection"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="shadow-md lg:col-span-2 xl:col-span-1" data-testid="card-achievements">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-chart-4" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Weeks Completed</span>
                <span className="font-semibold">{Math.max(0, (user?.currentWeek || 1) - 1)} / 8</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Challenges Done</span>
                <span className="font-semibold">
                  {data.activeChallenges.filter(uc => uc.completed).length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Longest Streak</span>
                <span className="font-semibold">{user?.streak || 0} days</span>
              </div>
              <Link href="/dashboard/profile">
                <Button variant="outline" className="w-full mt-2 hover-elevate active-elevate-2" data-testid="button-view-profile">
                  View Full Profile
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assigned Tasks Section */}
      {tasks && tasks.length > 0 && (
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-chart-4" />
              Assigned Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tasks.map((task) => {
                const hasSubmission = !!task.submission;
                const isRated = hasSubmission && task.submission?.rating;
                
                return (
                  <div key={task.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">{task.title}</h4>
                        <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          {task.dueDate && (
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Due: {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {isRated ? (
                          <Badge variant="default" className="bg-green-500">
                            ⭐ Rated {task.submission?.rating}/5
                          </Badge>
                        ) : hasSubmission ? (
                          <Badge variant="secondary">
                            Submitted
                          </Badge>
                        ) : (
                          <Badge variant="outline">
                            Pending
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    {!hasSubmission && (
                      <Button 
                        size="sm" 
                        onClick={() => openSubmitDialog(task)}
                        className="w-full"
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Submit Task
                      </Button>
                    )}
                    
                    {hasSubmission && task.submission?.feedback && (
                      <div className="mt-2 p-3 bg-muted rounded-md">
                        <p className="text-xs font-semibold mb-1">Feedback:</p>
                        <p className="text-sm">{task.submission.feedback}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Announcements */}
      {data.announcements.length > 0 && (
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-chart-5" />
              Latest Updates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.announcements.slice(0, 3).map((announcement) => (
                <div key={announcement.id} className="border-l-4 border-primary pl-4 py-2">
                  <h4 className="font-semibold mb-1">{announcement.title}</h4>
                  <p className="text-sm text-muted-foreground">{announcement.content}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(announcement.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Submit Task Dialog */}
      <Dialog open={submitDialogOpen} onOpenChange={setSubmitDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Task</DialogTitle>
            <DialogDescription>
              Submit your work for: {selectedTask?.title}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="submission">Your Submission</Label>
              <Textarea
                id="submission"
                placeholder="Enter your task submission here..."
                value={submissionContent}
                onChange={(e) => setSubmissionContent(e.target.value)}
                rows={6}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSubmitDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitTask} disabled={submitTaskMutation.isPending}>
              {submitTaskMutation.isPending ? "Submitting..." : "Submit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
