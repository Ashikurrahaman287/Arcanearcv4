import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAuthState } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User, Trophy, Flame, BookOpen, Target, Calendar, Award, Edit2, Save, X } from "lucide-react";
import type { User as UserType, UserAchievement, Achievement } from "@shared/schema";
import { useState, useEffect } from "react";

interface ProfileData {
  user: UserType;
  achievements: (UserAchievement & { achievement: Achievement })[];
  stats: {
    completedWeeks: number;
    completedChallenges: number;
    longestStreak: number;
  };
}

const profileFormSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  bio: z.string().optional(),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  location: z.string().optional(),
  occupation: z.string().optional(),
  goals: z.string().optional(),
  emergencyContact: z.string().optional(),
  emergencyPhone: z.string().optional(),
  profilePicture: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

type ProfileFormData = z.infer<typeof profileFormSchema>;

export default function Profile() {
  const { user } = getAuthState();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  const { data, isLoading } = useQuery<ProfileData>({
    queryKey: ["/api/profile"],
  });

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      fullName: data?.user?.fullName || "",
      bio: data?.user?.bio || "",
      phone: data?.user?.phone || "",
      dateOfBirth: data?.user?.dateOfBirth ? new Date(data.user.dateOfBirth).toISOString().split('T')[0] : "",
      location: data?.user?.location || "",
      occupation: data?.user?.occupation || "",
      goals: data?.user?.goals || "",
      emergencyContact: data?.user?.emergencyContact || "",
      emergencyPhone: data?.user?.emergencyPhone || "",
      profilePicture: data?.user?.profilePicture || "",
    },
  });

  useEffect(() => {
    if (data?.user) {
      form.reset({
        fullName: data.user.fullName || "",
        bio: data.user.bio || "",
        phone: data.user.phone || "",
        dateOfBirth: data.user.dateOfBirth ? new Date(data.user.dateOfBirth).toISOString().split('T')[0] : "",
        location: data.user.location || "",
        occupation: data.user.occupation || "",
        goals: data.user.goals || "",
        emergencyContact: data.user.emergencyContact || "",
        emergencyPhone: data.user.emergencyPhone || "",
        profilePicture: data.user.profilePicture || "",
      });
    }
  }, [data?.user, form]);

  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileFormData) => {
      const payload: any = { ...data };
      if (data.dateOfBirth) {
        payload.dateOfBirth = new Date(data.dateOfBirth);
      }
      if (!data.profilePicture) {
        payload.profilePicture = null;
      }
      return await apiRequest("PATCH", "/api/profile", payload);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
      setIsEditing(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ProfileFormData) => {
    updateProfileMutation.mutate(data);
  };

  const handleCancel = () => {
    form.reset();
    setIsEditing(false);
  };

  if (isLoading || !data) {
    return (
      <div className="p-6 md:p-8 space-y-6">
        <Skeleton className="h-32 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      </div>
    );
  }

  const progress = ((user?.currentWeek || 1) / 8) * 100;

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2" data-testid="text-profile-title">
            Profile & Progress
          </h1>
          <p className="text-lg text-muted-foreground">
            Track your journey and celebrate your achievements
          </p>
        </div>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)} variant="outline">
            <Edit2 className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        )}
      </div>

      {/* Profile Card */}
      <Card className="shadow-md">
        <CardContent className="p-8">
          {!isEditing ? (
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <Avatar className="w-24 h-24">
                <AvatarImage src={data.user.profilePicture || undefined} />
                <AvatarFallback className="text-3xl font-bold bg-primary/10 text-primary">
                  {data.user.fullName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-bold mb-1">{data.user.fullName}</h2>
                <p className="text-muted-foreground mb-2">@{data.user.username}</p>
                {data.user.bio && (
                  <p className="text-sm text-muted-foreground mb-4">{data.user.bio}</p>
                )}

                <div className="flex flex-wrap gap-3 justify-center md:justify-start mb-4">
                  <Badge variant="outline" className="px-3 py-1">
                    <User className="h-3 w-3 mr-1" />
                    {data.user.role === "admin" ? "Admin" : "Member"}
                  </Badge>
                  <Badge variant="outline" className="px-3 py-1">
                    <Calendar className="h-3 w-3 mr-1" />
                    Joined {new Date(data.user.createdAt || "").toLocaleDateString()}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  {data.user.phone && (
                    <div>
                      <span className="font-semibold">Phone:</span> {data.user.phone}
                    </div>
                  )}
                  {data.user.dateOfBirth && (
                    <div>
                      <span className="font-semibold">Date of Birth:</span> {new Date(data.user.dateOfBirth).toLocaleDateString()}
                    </div>
                  )}
                  {data.user.location && (
                    <div>
                      <span className="font-semibold">Location:</span> {data.user.location}
                    </div>
                  )}
                  {data.user.occupation && (
                    <div>
                      <span className="font-semibold">Occupation:</span> {data.user.occupation}
                    </div>
                  )}
                  {data.user.emergencyContact && (
                    <div>
                      <span className="font-semibold">Emergency Contact:</span> {data.user.emergencyContact}
                    </div>
                  )}
                  {data.user.emergencyPhone && (
                    <div>
                      <span className="font-semibold">Emergency Phone:</span> {data.user.emergencyPhone}
                    </div>
                  )}
                </div>

                {data.user.goals && (
                  <div className="mt-4">
                    <p className="font-semibold text-sm mb-1">Goals:</p>
                    <p className="text-sm text-muted-foreground">{data.user.goals}</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex items-center gap-6 mb-6">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={form.watch("profilePicture") || data.user.profilePicture || undefined} />
                  <AvatarFallback className="text-3xl font-bold bg-primary/10 text-primary">
                    {data.user.fullName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Label htmlFor="profilePicture">Profile Picture URL</Label>
                  <Input
                    id="profilePicture"
                    {...form.register("profilePicture")}
                    placeholder="https://example.com/avatar.jpg"
                  />
                  {form.formState.errors.profilePicture && (
                    <p className="text-sm text-destructive mt-1">
                      {form.formState.errors.profilePicture.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input id="fullName" {...form.register("fullName")} />
                  {form.formState.errors.fullName && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.fullName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" {...form.register("phone")} placeholder="+1 (555) 123-4567" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input id="dateOfBirth" type="date" {...form.register("dateOfBirth")} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" {...form.register("location")} placeholder="City, Country" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="occupation">Occupation</Label>
                  <Input id="occupation" {...form.register("occupation")} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergencyContact">Emergency Contact</Label>
                  <Input id="emergencyContact" {...form.register("emergencyContact")} />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="emergencyPhone">Emergency Phone</Label>
                  <Input id="emergencyPhone" {...form.register("emergencyPhone")} placeholder="+1 (555) 123-4567" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea id="bio" {...form.register("bio")} rows={3} placeholder="Tell us about yourself..." />
              </div>

              <div className="space-y-2">
                <Label htmlFor="goals">Goals</Label>
                <Textarea id="goals" {...form.register("goals")} rows={3} placeholder="What are your goals?" />
              </div>

              <div className="flex gap-3 justify-end">
                <Button type="button" variant="outline" onClick={handleCancel}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button type="submit" disabled={updateProfileMutation.isPending}>
                  <Save className="h-4 w-4 mr-2" />
                  {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      {/* Progress Overview */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            Overall Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Week {user?.currentWeek} of 8</span>
              <span className="text-sm font-bold text-primary">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="p-3 rounded-xl bg-chart-1/10 w-fit mx-auto mb-2">
                <Target className="h-8 w-8 text-chart-1" />
              </div>
              <p className="text-2xl font-bold">{data.stats.completedWeeks}</p>
              <p className="text-sm text-muted-foreground">Weeks Completed</p>
            </div>

            <div className="text-center">
              <div className="p-3 rounded-xl bg-chart-2/10 w-fit mx-auto mb-2">
                <Flame className="h-8 w-8 text-chart-2" />
              </div>
              <p className="text-2xl font-bold">{user?.streak || 0}</p>
              <p className="text-sm text-muted-foreground">Current Streak</p>
            </div>

            <div className="text-center">
              <div className="p-3 rounded-xl bg-chart-3/10 w-fit mx-auto mb-2">
                <BookOpen className="h-8 w-8 text-chart-3" />
              </div>
              <p className="text-2xl font-bold">{user?.totalJournals || 0}</p>
              <p className="text-sm text-muted-foreground">Journal Entries</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-chart-4" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          {data.achievements.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {data.achievements.map((userAchievement) => (
                <div
                  key={userAchievement.id}
                  className="text-center p-4 rounded-xl bg-primary/5 border border-primary/20"
                  data-testid={`badge-${userAchievement.achievement.id}`}
                >
                  <div className="text-4xl mb-2">🏆</div>
                  <p className="font-semibold text-sm mb-1">{userAchievement.achievement.name}</p>
                  <p className="text-xs text-muted-foreground mb-2">
                    {userAchievement.achievement.description}
                  </p>
                  <p className="text-xs text-primary">
                    {new Date(userAchievement.unlockedAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                No achievements yet. Keep going to unlock your first badge!
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
