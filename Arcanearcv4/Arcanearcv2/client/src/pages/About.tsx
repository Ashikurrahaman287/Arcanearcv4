import { PublicHeader } from "@/components/PublicHeader";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Target, BookOpen, Dumbbell, Brain, Briefcase, Heart, Snowflake, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const corePillars = [
  {
    icon: Target,
    title: "Self",
    description: "Deep introspection and understanding of your authentic self",
    color: "text-chart-1",
  },
  {
    icon: BookOpen,
    title: "Skill",
    description: "Continuous learning and mastery of new abilities",
    color: "text-chart-2",
  },
  {
    icon: Dumbbell,
    title: "Body",
    description: "Physical health, fitness, and vitality",
    color: "text-chart-3",
  },
  {
    icon: Brain,
    title: "Mind",
    description: "Mental clarity, mindfulness, and spiritual growth",
    color: "text-chart-4",
  },
  {
    icon: Sparkles,
    title: "Spirit",
    description: "Connection to purpose and deeper meaning",
    color: "text-chart-5",
  },
  {
    icon: Briefcase,
    title: "Career",
    description: "Professional growth and purposeful work",
    color: "text-chart-1",
  },
  {
    icon: Heart,
    title: "Relationship",
    description: "Meaningful connections and social bonds",
    color: "text-chart-2",
  },
];

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />

      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-muted/50 to-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
            <Snowflake className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Our Philosophy</span>
          </div>

          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight" data-testid="text-about-title">
            More Than a Program
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Arcane Arc is not just a program — it's a journey through reflection, discipline, and growth.
            A transformative experience designed to help you unlock your potential during the transformative winter season.
          </p>
        </div>
      </section>

      {/* Origin Story */}
      <section className="py-20 md:py-24 bg-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-serif text-4xl md:text-5xl font-semibold mb-6">
                Origin of the Winter Arc
              </h2>
              <div className="space-y-4 text-lg text-muted-foreground">
                <p>
                  The concept of the Winter Arc emerged from an ancient understanding that winter
                  represents a period of introspection, renewal, and transformation. Just as nature
                  retreats to gather strength for spring, we too can use this season for deep personal growth.
                </p>
                <p>
                  Founded by transformation coach Ashik, the Arcane Arc Program combines modern goal-setting
                  methodologies with timeless wisdom about seasonal cycles and personal development. It's
                  designed for those who refuse to hibernate through winter but instead choose to emerge
                  stronger, wiser, and more aligned with their true selves.
                </p>
                <p>
                  Over the years, thousands have completed the Winter Arc, reporting profound changes in
                  their mindset, habits, and overall life satisfaction. This isn't about temporary motivation —
                  it's about sustainable transformation.
                </p>
              </div>
            </div>

            <Card className="hover-elevate">
              <CardContent className="p-8">
                <blockquote className="border-l-4 border-primary pl-6 py-4">
                  <p className="font-serif text-2xl mb-4 italic">
                    "Winter is not a season to endure, but a canvas to paint your transformation."
                  </p>
                  <footer className="text-muted-foreground">— Ashik, Founder</footer>
                </blockquote>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Core Pillars */}
      <section className="py-20 md:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-semibold mb-4">
              The Seven Core Pillars
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Holistic transformation across all dimensions of your life
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {corePillars.map((pillar, index) => {
              const Icon = pillar.icon;
              return (
                <Card key={index} className="hover-elevate transition-all" data-testid={`card-pillar-${index}`}>
                  <CardContent className="p-6">
                    <div className={`p-3 rounded-xl bg-card mb-4 w-fit ${pillar.color}`}>
                      <Icon className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{pillar.title}</h3>
                    <p className="text-muted-foreground">{pillar.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Methodology */}
      <section className="py-20 md:py-24 bg-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-4xl md:text-5xl font-semibold mb-12 text-center">
            Our Methodology
          </h2>

          <div className="space-y-8">
            <Card className="hover-elevate">
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold mb-4">1. Structured Reflection</h3>
                <p className="text-lg text-muted-foreground">
                  Daily journaling prompts guide you to examine your achievements, challenges, and
                  gratitude. This consistent practice builds self-awareness and tracks your growth over time.
                </p>
              </CardContent>
            </Card>

            <Card className="hover-elevate">
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold mb-4">2. Progressive Challenges</h3>
                <p className="text-lg text-muted-foreground">
                  Each week introduces new challenges aligned with that week's theme. These aren't
                  overwhelming — they're carefully designed to be achievable yet transformative.
                </p>
              </CardContent>
            </Card>

            <Card className="hover-elevate">
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold mb-4">3. Gamified Progress</h3>
                <p className="text-lg text-muted-foreground">
                  Track your streaks, earn badges, and visualize your progress. Gamification makes
                  the journey engaging while maintaining the depth of real transformation.
                </p>
              </CardContent>
            </Card>

            <Card className="hover-elevate">
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold mb-4">4. Community Support</h3>
                <p className="text-lg text-muted-foreground">
                  You're not alone on this journey. Connect with fellow members, share insights,
                  and draw inspiration from others pursuing the same path of growth.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">
            Begin Your Transformation
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join the Winter Arc and discover what you're truly capable of achieving.
          </p>
          <Link href="/signup">
            <Button size="lg" className="text-lg px-8 h-14 hover-elevate active-elevate-2" data-testid="button-about-join">
              Join the Program
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
