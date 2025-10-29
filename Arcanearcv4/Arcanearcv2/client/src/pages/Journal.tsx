import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { BookOpen, Save, Calendar, Smile, Meh, Frown, Sparkles } from "lucide-react";
import { Journal as JournalType } from "@shared/schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const moodOptions = [
  { value: "great", label: "Great", icon: Sparkles, color: "text-chart-1" },
  { value: "good", label: "Good", icon: Smile, color: "text-chart-2" },
  { value: "okay", label: "Okay", icon: Meh, color: "text-chart-3" },
  { value: "challenging", label: "Challenging", icon: Frown, color: "text-chart-4" },
];

export default function Journal() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    achievement: "",
    challenge: "",
    gratitude: "",
    mood: "good",
  });

  const { data: journals, isLoading } = useQuery<JournalType[]>({
    queryKey: ["/api/journals"],
  });

  const { data: todayJournal } = useQuery<JournalType | null>({
    queryKey: ["/api/journals/today"],
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/journals", formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/journals"] });
      queryClient.invalidateQueries({ queryKey: ["/api/journals/today"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      toast({
        title: "Journal entry saved! 📝",
        description: "Your reflection has been recorded.",
      });
      setFormData({
        achievement: "",
        challenge: "",
        gratitude: "",
        mood: "good",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save journal entry",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate();
  };

  if (isLoading) {
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
        <h1 className="text-3xl md:text-4xl font-bold mb-2" data-testid="text-journal-title">
          Daily Journal
        </h1>
        <p className="text-lg text-muted-foreground">
          Reflect on your journey and track your growth
        </p>
      </div>

      {/* Today's Entry */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Today's Reflection
          </CardTitle>
        </CardHeader>
        <CardContent>
          {todayJournal ? (
            <div className="space-y-4">
              <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                <p className="text-sm text-primary font-medium mb-2">✓ You've already journaled today!</p>
                <p className="text-sm text-muted-foreground">
                  Your entry has been saved. Come back tomorrow to continue your reflection practice.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm font-medium mb-2 block">What did I achieve today?</Label>
                  <p className="text-muted-foreground">{todayJournal.achievement || "—"}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium mb-2 block">What challenged me?</Label>
                  <p className="text-muted-foreground">{todayJournal.challenge || "—"}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium mb-2 block">What am I grateful for?</Label>
                  <p className="text-muted-foreground">{todayJournal.gratitude || "—"}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium mb-2 block">Mood</Label>
                  <p className="text-muted-foreground capitalize">{todayJournal.mood || "—"}</p>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="achievement">What did I achieve today? ✨</Label>
                <Textarea
                  id="achievement"
                  placeholder="Reflect on your accomplishments, big or small..."
                  value={formData.achievement}
                  onChange={(e) => setFormData({ ...formData, achievement: e.target.value })}
                  className="min-h-24 resize-y"
                  data-testid="input-achievement"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="challenge">What challenged me? 💪</Label>
                <Textarea
                  id="challenge"
                  placeholder="Acknowledge the obstacles you faced and how you responded..."
                  value={formData.challenge}
                  onChange={(e) => setFormData({ ...formData, challenge: e.target.value })}
                  className="min-h-24 resize-y"
                  data-testid="input-challenge"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gratitude">What am I grateful for? 🙏</Label>
                <Textarea
                  id="gratitude"
                  placeholder="Express gratitude for the people, experiences, or moments..."
                  value={formData.gratitude}
                  onChange={(e) => setFormData({ ...formData, gratitude: e.target.value })}
                  className="min-h-24 resize-y"
                  data-testid="input-gratitude"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mood">How was your day? 😊</Label>
                <Select value={formData.mood} onValueChange={(value) => setFormData({ ...formData, mood: value })}>
                  <SelectTrigger id="mood" className="h-12" data-testid="select-mood">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {moodOptions.map((option) => {
                      const Icon = option.icon;
                      return (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            <Icon className={`h-4 w-4 ${option.color}`} />
                            <span>{option.label}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                className="w-full h-12 hover-elevate active-elevate-2"
                disabled={createMutation.isPending}
                data-testid="button-save-journal"
              >
                <Save className="mr-2 h-4 w-4" />
                {createMutation.isPending ? "Saving..." : "Save Reflection"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>

      {/* Past Entries */}
      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Calendar className="h-6 w-6 text-primary" />
          Past Reflections
        </h2>

        {journals && journals.length > 0 ? (
          <div className="space-y-4">
            {journals.slice(0, 10).map((journal) => (
              <Card key={journal.id} className="hover-elevate transition-all" data-testid={`card-journal-${journal.id}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium text-muted-foreground">
                      {new Date(journal.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    {journal.mood && (
                      <span className="text-xs px-2 py-1 rounded-full bg-muted capitalize">
                        {journal.mood}
                      </span>
                    )}
                  </div>
                  <div className="space-y-3 text-sm">
                    {journal.achievement && (
                      <div>
                        <p className="font-medium mb-1">Achievement:</p>
                        <p className="text-muted-foreground">{journal.achievement}</p>
                      </div>
                    )}
                    {journal.challenge && (
                      <div>
                        <p className="font-medium mb-1">Challenge:</p>
                        <p className="text-muted-foreground">{journal.challenge}</p>
                      </div>
                    )}
                    {journal.gratitude && (
                      <div>
                        <p className="font-medium mb-1">Gratitude:</p>
                        <p className="text-muted-foreground">{journal.gratitude}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No past entries yet. Start journaling today!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
