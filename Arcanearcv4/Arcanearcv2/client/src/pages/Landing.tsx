import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PublicHeader } from "@/components/PublicHeader";
import { Footer } from "@/components/Footer";
import heroImage from "@assets/generated_images/Mountain_sunrise_aurora_hero_37a6693b.png";
import mentorImage from "@assets/generated_images/Professional_mentor_portrait_eb94b154.png";
import {
  Target,
  BookOpen,
  Dumbbell,
  Brain,
  Briefcase,
  Heart,
  Flame,
  Trophy,
  Users,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

const weeklyThemes = [
  { week: 1, title: "Self Reflection", icon: Target, color: "text-chart-1" },
  { week: 2, title: "Skill Growth", icon: BookOpen, color: "text-chart-2" },
  { week: 3, title: "Physical Health", icon: Dumbbell, color: "text-chart-3" },
  { week: 4, title: "Mind & Spirit", icon: Brain, color: "text-chart-4" },
  { week: 5, title: "Knowledge", icon: Sparkles, color: "text-chart-5" },
  { week: 6, title: "Career", icon: Briefcase, color: "text-chart-1" },
  { week: 7, title: "Relationship", icon: Heart, color: "text-chart-2" },
  { week: 8, title: "Integration", icon: Trophy, color: "text-primary" },
];

const features = [
  {
    icon: Target,
    title: "Set Goals",
    description: "Define clear, actionable goals for your 8-week transformation journey",
  },
  {
    icon: Flame,
    title: "Track Progress",
    description: "Build streaks and see your growth visualized with beautiful progress charts",
  },
  {
    icon: BookOpen,
    title: "Daily Reflection",
    description: "Journal your achievements, challenges, and gratitude every single day",
  },
  {
    icon: Trophy,
    title: "Earn Badges",
    description: "Unlock achievements as you complete challenges and reach milestones",
  },
  {
    icon: Brain,
    title: "Learn & Grow",
    description: "Access curated resources on self-discipline, health, business, and mindfulness",
  },
  {
    icon: Users,
    title: "Community",
    description: "Connect with others on the same transformative journey",
  },
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Software Engineer",
    content: "The Winter Arc changed my life. The daily reflection kept me accountable, and I finally built the habits I've been dreaming about for years.",
    avatar: "SC",
  },
  {
    name: "Michael Torres",
    role: "Entrepreneur",
    content: "This program gave me structure and clarity. The weekly themes helped me focus on what truly matters. I'm now in the best shape of my life, mentally and physically.",
    avatar: "MT",
  },
  {
    name: "Emma Williams",
    role: "Designer",
    content: "I loved the combination of challenge tracking and journaling. Seeing my streak grow motivated me every single day. Highly recommend!",
    avatar: "EW",
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${heroImage})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Winter Arc 2025</span>
          </div>

          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight" data-testid="text-hero-title">
            Unlock Your Winter Potential
          </h1>

          <p className="text-xl sm:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Transform your winter into a journey of reflection, discipline, and growth.
            Join thousands on the path to becoming your best self.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="text-lg px-8 h-14 w-full sm:w-auto hover-elevate active-elevate-2" data-testid="button-hero-join">
                Join the Arcane Arc Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/program">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 h-14 w-full sm:w-auto backdrop-blur-sm bg-background/30 hover-elevate active-elevate-2"
                data-testid="button-hero-learn"
              >
                Learn More
              </Button>
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-foreground/30 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-foreground/30 rounded-full" />
          </div>
        </div>
      </section>

      {/* 8-Week Program Overview */}
      <section className="py-20 md:py-24 lg:py-32 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-semibold mb-4" data-testid="text-program-title">
              Your 8-Week Transformation
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Each week focuses on a core pillar of personal growth, building a holistic transformation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {weeklyThemes.map((theme) => {
              const Icon = theme.icon;
              return (
                <Card
                  key={theme.week}
                  className="hover-elevate transition-all duration-300 overflow-visible"
                  data-testid={`card-week-${theme.week}`}
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center">
                      <div className={`p-4 rounded-2xl bg-card mb-4 ${theme.color}`}>
                        <Icon className="h-8 w-8" />
                      </div>
                      <div className="text-sm font-medium text-muted-foreground mb-1">
                        Week {theme.week}
                      </div>
                      <h3 className="text-lg font-semibold">{theme.title}</h3>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-semibold mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A comprehensive platform designed to support your transformation journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="hover-elevate transition-all" data-testid={`card-feature-${index}`}>
                  <CardContent className="p-8">
                    <div className="p-3 rounded-xl bg-primary/10 w-fit mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 md:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-semibold mb-4">
              Success Stories
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands who have transformed their lives through the Winter Arc
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover-elevate transition-all" data-testid={`card-testimonial-${index}`}>
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="font-semibold text-primary">{testimonial.avatar}</span>
                    </div>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                  <p className="text-muted-foreground italic">&ldquo;{testimonial.content}&rdquo;</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Meet the Mentor */}
      <section className="py-20 md:py-24 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="font-serif text-4xl md:text-5xl font-semibold mb-6">
                Meet the Mentor: Ashik
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                With years of experience in personal development and transformation coaching,
                Ashik has helped thousands of individuals unlock their true potential through
                structured programs and mindful reflection.
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <p className="text-muted-foreground">
                    Certified life coach specializing in seasonal transformation programs
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <p className="text-muted-foreground">
                    10+ years guiding individuals through personal growth journeys
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <p className="text-muted-foreground">
                    Creator of the Winter Arc methodology combining discipline and reflection
                  </p>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="rounded-2xl overflow-hidden shadow-xl">
                <img
                  src={mentorImage}
                  alt="Ashik - Mentor and Guide"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Ready to Transform Your Winter?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join the Arcane Arc Program today and embark on your 8-week journey to becoming
            your best self.
          </p>
          <Link href="/signup">
            <Button size="lg" className="text-lg px-8 h-14 hover-elevate active-elevate-2" data-testid="button-cta-join">
              Start Your Journey Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
