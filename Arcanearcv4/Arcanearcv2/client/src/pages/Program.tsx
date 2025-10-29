import { PublicHeader } from "@/components/PublicHeader";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  Target,
  BookOpen,
  Dumbbell,
  Brain,
  Briefcase,
  Heart,
  CheckCircle2,
  Calendar,
  TrendingUp,
  Award,
  Sparkles,
  Trophy,
} from "lucide-react";

const weeklyProgram = [
  {
    week: 1,
    title: "Self Reflection",
    icon: Target,
    color: "text-chart-1",
    bgColor: "bg-chart-1/10",
    description: "Begin your journey with deep self-discovery and understanding your current state.",
    activities: [
      "Complete a comprehensive self-assessment",
      "Define your core values and priorities",
      "Set meaningful 8-week transformation goals",
      "Establish your daily reflection routine",
    ],
  },
  {
    week: 2,
    title: "Skill Growth",
    icon: BookOpen,
    color: "text-chart-2",
    bgColor: "bg-chart-2/10",
    description: "Identify skills you want to develop and create a learning roadmap.",
    activities: [
      "Choose 1-2 skills to focus on this winter",
      "Access curated learning resources",
      "Complete daily skill-building exercises",
      "Track your learning progress",
    ],
  },
  {
    week: 3,
    title: "Physical Health",
    icon: Dumbbell,
    color: "text-chart-3",
    bgColor: "bg-chart-3/10",
    description: "Build sustainable fitness habits and optimize your physical well-being.",
    activities: [
      "Establish a consistent exercise routine",
      "Plan nutritious meals for the week",
      "Track sleep quality and energy levels",
      "Complete physical wellness challenges",
    ],
  },
  {
    week: 4,
    title: "Mind & Spirit",
    icon: Brain,
    color: "text-chart-4",
    bgColor: "bg-chart-4/10",
    description: "Cultivate mental clarity through mindfulness and spiritual practices.",
    activities: [
      "Practice daily meditation or mindfulness",
      "Explore spiritual or philosophical readings",
      "Journal about deeper questions and purpose",
      "Reduce digital distractions mindfully",
    ],
  },
  {
    week: 5,
    title: "Knowledge Expansion",
    icon: Sparkles,
    color: "text-chart-5",
    bgColor: "bg-chart-5/10",
    description: "Broaden your horizons with new ideas, books, and perspectives.",
    activities: [
      "Read transformative books or articles",
      "Engage with educational content daily",
      "Take notes on key insights",
      "Apply new knowledge to your life",
    ],
  },
  {
    week: 6,
    title: "Career Growth",
    icon: Briefcase,
    color: "text-chart-1",
    bgColor: "bg-chart-1/10",
    description: "Advance your professional goals and clarify your career vision.",
    activities: [
      "Define career objectives for the year",
      "Update your skills and portfolio",
      "Network with professionals in your field",
      "Complete career-building challenges",
    ],
  },
  {
    week: 7,
    title: "Relationships",
    icon: Heart,
    color: "text-chart-2",
    bgColor: "bg-chart-2/10",
    description: "Strengthen connections and build meaningful relationships.",
    activities: [
      "Reach out to important people in your life",
      "Practice active listening and empathy",
      "Set boundaries where needed",
      "Express gratitude to others",
    ],
  },
  {
    week: 8,
    title: "Integration & Celebration",
    icon: Trophy,
    color: "text-primary",
    bgColor: "bg-primary/10",
    description: "Integrate all learnings and celebrate your transformation.",
    activities: [
      "Review your 8-week journey",
      "Celebrate achievements and progress",
      "Create a sustainable maintenance plan",
      "Set goals for continued growth",
    ],
  },
];

const programFeatures = [
  {
    icon: Calendar,
    title: "Daily Check-ins",
    description: "Structured prompts to reflect on achievements, challenges, and gratitude",
  },
  {
    icon: TrendingUp,
    title: "Progress Tracking",
    description: "Visual dashboards showing your growth across all dimensions",
  },
  {
    icon: Award,
    title: "Achievement System",
    description: "Unlock badges and rewards as you complete milestones",
  },
  {
    icon: CheckCircle2,
    title: "Weekly Challenges",
    description: "Curated activities designed to push you outside your comfort zone",
  },
];

export default function Program() {
  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />

      {/* Hero */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-muted/50 to-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight" data-testid="text-program-hero">
            The 8-Week Journey
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            A comprehensive, week-by-week transformation program designed to help you grow
            holistically across all areas of life.
          </p>
        </div>
      </section>

      {/* Weekly Breakdown */}
      <section className="py-20 md:py-24 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-semibold mb-4">
              Week-by-Week Structure
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Each week builds upon the last, creating a comprehensive transformation
            </p>
          </div>

          <div className="space-y-8">
            {weeklyProgram.map((week) => {
              const Icon = week.icon;
              return (
                <Card key={week.week} className="hover-elevate transition-all" data-testid={`card-week-detail-${week.week}`}>
                  <CardContent className="p-8">
                    <div className="flex flex-col lg:flex-row gap-6">
                      <div className="flex-shrink-0">
                        <div className={`p-6 rounded-2xl ${week.bgColor} w-fit`}>
                          <Icon className={`h-12 w-12 ${week.color}`} />
                        </div>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-baseline gap-3 mb-3">
                          <span className="text-sm font-semibold text-muted-foreground">
                            WEEK {week.week}
                          </span>
                          <h3 className="text-2xl font-serif font-bold">{week.title}</h3>
                        </div>

                        <p className="text-lg text-muted-foreground mb-4">
                          {week.description}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {week.activities.map((activity, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                              <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                              <span className="text-muted-foreground">{activity}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Program Features */}
      <section className="py-20 md:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-semibold mb-4">
              What's Included
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to succeed in your transformation journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {programFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="hover-elevate transition-all" data-testid={`card-program-feature-${index}`}>
                  <CardContent className="p-6 text-center">
                    <div className="p-3 rounded-xl bg-primary/10 w-fit mx-auto mb-4">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">
            Start Your 8-Week Transformation
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of members who have completed the Winter Arc and emerged transformed.
          </p>
          <Link href="/signup">
            <Button size="lg" className="text-lg px-8 h-14 hover-elevate active-elevate-2" data-testid="button-program-join">
              Join the Arcane Arc
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
