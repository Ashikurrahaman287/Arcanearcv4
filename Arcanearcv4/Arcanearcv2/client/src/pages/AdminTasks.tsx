import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Star, CheckCircle2, Clock, Calendar, User as UserIcon, FileText } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Task, TaskSubmission, User } from "@shared/schema";

const ratingSchema = z.object({
  rating: z.number().min(1, "Rating is required").max(5),
  feedback: z.string().min(20, "Feedback must be at least 20 characters"),
});

type RatingFormData = z.infer<typeof ratingSchema>;

interface TaskSubmissionWithUser extends TaskSubmission {
  user?: User;
}

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  interactive?: boolean;
}

function StarRating({ rating, onRatingChange, interactive = false }: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-5 w-5 ${
            star <= (interactive ? (hoverRating || rating) : rating)
              ? "fill-yellow-400 text-yellow-400"
              : "text-gray-300"
          } ${interactive ? "cursor-pointer" : ""}`}
          onClick={() => interactive && onRatingChange?.(star)}
          onMouseEnter={() => interactive && setHoverRating(star)}
          onMouseLeave={() => interactive && setHoverRating(0)}
        />
      ))}
    </div>
  );
}

interface RatingDialogProps {
  submission: TaskSubmissionWithUser;
  onRatingSubmitted: () => void;
}

function RatingDialog({ submission, onRatingSubmitted }: RatingDialogProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const form = useForm<RatingFormData>({
    resolver: zodResolver(ratingSchema),
    defaultValues: {
      rating: submission.rating || 0,
      feedback: submission.feedback || "",
    },
  });

  const rateSubmissionMutation = useMutation({
    mutationFn: async (data: RatingFormData) => {
      return apiRequest("PATCH", `/api/admin/submissions/${submission.id}/rate`, data);
    },
    onSuccess: () => {
      toast({
        title: "Submission rated",
        description: "The submission has been rated successfully.",
      });
      setOpen(false);
      form.reset();
      onRatingSubmitted();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to rate submission",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: RatingFormData) => {
    rateSubmissionMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Star className="h-4 w-4 mr-2" />
          {submission.rating ? "Update Rating" : "Rate Submission"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Rate Submission - {submission.user?.fullName}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <h4 className="font-medium">Submission Content:</h4>
              <div className="p-4 rounded-lg bg-muted max-h-48 overflow-y-auto">
                <p className="text-sm whitespace-pre-wrap">{submission.content}</p>
              </div>
            </div>

            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating (1-5 stars)</FormLabel>
                  <FormControl>
                    <div>
                      <StarRating
                        rating={field.value}
                        onRatingChange={field.onChange}
                        interactive={true}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="feedback"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Feedback (minimum 20 characters)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Provide detailed feedback for the student..."
                      rows={6}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={rateSubmissionMutation.isPending}>
                {rateSubmissionMutation.isPending ? "Submitting..." : "Submit Rating"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminTasks() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: tasks, isLoading: tasksLoading } = useQuery<Task[]>({
    queryKey: ["/api/admin/tasks"],
  });

  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const { data: submissions, isLoading: submissionsLoading } = useQuery<TaskSubmissionWithUser[]>({
    queryKey: ["/api/admin/tasks", selectedTaskId, "submissions"],
    enabled: !!selectedTaskId,
  });

  const handleRatingSubmitted = () => {
    queryClient.invalidateQueries({ 
      queryKey: ["/api/admin/tasks", selectedTaskId, "submissions"] 
    });
  };

  const calculateAverageRating = (taskId: string, taskSubmissions: TaskSubmissionWithUser[]) => {
    const ratedSubmissions = taskSubmissions?.filter(s => s.rating) || [];
    if (ratedSubmissions.length === 0) return 0;
    const sum = ratedSubmissions.reduce((acc, s) => acc + (s.rating || 0), 0);
    return sum / ratedSubmissions.length;
  };

  if (tasksLoading) {
    return (
      <div className="p-6 md:p-8 space-y-6">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Task Submissions</h1>
        <p className="text-lg text-muted-foreground">
          Review and rate student task submissions
        </p>
      </div>

      {tasks && tasks.length > 0 ? (
        <Accordion type="single" collapsible className="space-y-4">
          {tasks.map((task) => {
            const taskSubmissions = selectedTaskId === task.id ? submissions || [] : [];
            const submissionCount = taskSubmissions.length;
            const averageRating = calculateAverageRating(task.id, taskSubmissions);
            const ratedCount = taskSubmissions.filter(s => s.rating).length;

            return (
              <AccordionItem key={task.id} value={task.id} className="border rounded-lg">
                <AccordionTrigger
                  className="px-6 hover:no-underline"
                  onClick={() => setSelectedTaskId(task.id)}
                >
                  <div className="flex items-center justify-between w-full pr-4">
                    <div className="flex-1 text-left">
                      <h3 className="text-lg font-semibold mb-1">{task.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {task.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      {task.dueDate && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {new Date(task.dueDate).toLocaleDateString()}
                        </div>
                      )}
                      {selectedTaskId === task.id && submissionCount > 0 && (
                        <>
                          <Badge variant="secondary">
                            {submissionCount} {submissionCount === 1 ? "submission" : "submissions"}
                          </Badge>
                          {averageRating > 0 && (
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-medium">
                                {averageRating.toFixed(1)}
                              </span>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  {submissionsLoading ? (
                    <div className="space-y-4 mt-4">
                      <Skeleton className="h-32 w-full" />
                      <Skeleton className="h-32 w-full" />
                    </div>
                  ) : taskSubmissions.length > 0 ? (
                    <div className="space-y-4 mt-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-muted-foreground">
                          {ratedCount} of {submissionCount} rated
                        </p>
                      </div>
                      {taskSubmissions.map((submission) => (
                        <Card key={submission.id} className="shadow-sm">
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                  <span className="font-semibold text-sm text-primary">
                                    {submission.user?.fullName
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")
                                      .toUpperCase()
                                      .slice(0, 2)}
                                  </span>
                                </div>
                                <div>
                                  <h4 className="font-semibold">
                                    {submission.user?.fullName || "Unknown User"}
                                  </h4>
                                  <p className="text-sm text-muted-foreground">
                                    Submitted {new Date(submission.submittedAt).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {submission.rating ? (
                                  <Badge variant="default" className="gap-1">
                                    <CheckCircle2 className="h-3 w-3" />
                                    Rated
                                  </Badge>
                                ) : (
                                  <Badge variant="secondary" className="gap-1">
                                    <Clock className="h-3 w-3" />
                                    Pending Review
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div>
                              <h5 className="text-sm font-medium mb-2 flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                Submission:
                              </h5>
                              <div className="p-4 rounded-lg bg-muted">
                                <p className="text-sm whitespace-pre-wrap">{submission.content}</p>
                              </div>
                            </div>

                            {submission.rating && (
                              <div className="space-y-3">
                                <div>
                                  <h5 className="text-sm font-medium mb-2">Rating:</h5>
                                  <StarRating rating={submission.rating} />
                                </div>
                                {submission.feedback && (
                                  <div>
                                    <h5 className="text-sm font-medium mb-2">Feedback:</h5>
                                    <div className="p-4 rounded-lg bg-muted">
                                      <p className="text-sm whitespace-pre-wrap">
                                        {submission.feedback}
                                      </p>
                                    </div>
                                    {submission.reviewedAt && (
                                      <p className="text-xs text-muted-foreground mt-2">
                                        Reviewed on {new Date(submission.reviewedAt).toLocaleDateString()}
                                      </p>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}

                            <div className="flex justify-end">
                              <RatingDialog
                                submission={submission}
                                onRatingSubmitted={handleRatingSubmitted}
                              />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No submissions yet for this task</p>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No tasks created yet</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
