import { Link } from "wouter";
import { Snowflake } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-sidebar text-sidebar-foreground border-t border-sidebar-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Snowflake className="h-6 w-6 text-primary" />
              <span className="font-serif text-lg font-bold">Arcane Arc</span>
            </div>
            <p className="text-sm text-sidebar-foreground/80">
              Transform your winter into a journey of growth, reflection, and achievement.
            </p>
          </div>

          {/* About */}
          <div>
            <h3 className="font-semibold mb-3">About</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-sidebar-foreground/80 hover:text-primary transition-colors" data-testid="link-footer-about">
                  Our Philosophy
                </Link>
              </li>
              <li>
                <Link href="/program" className="text-sidebar-foreground/80 hover:text-primary transition-colors" data-testid="link-footer-program">
                  How It Works
                </Link>
              </li>
            </ul>
          </div>

          {/* Program */}
          <div>
            <h3 className="font-semibold mb-3">Program</h3>
            <ul className="space-y-2 text-sm text-sidebar-foreground/80">
              <li>8-Week Journey</li>
              <li>Daily Reflection</li>
              <li>Weekly Challenges</li>
              <li>Community Support</li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-3">Resources</h3>
            <ul className="space-y-2 text-sm text-sidebar-foreground/80">
              <li>Learning Hub</li>
              <li>Achievement Badges</li>
              <li>Progress Tracking</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-sidebar-border text-center text-sm text-sidebar-foreground/70">
          <p>&copy; {new Date().getFullYear()} Arcane Arc Program. All rights reserved.</p>
          <p className="mt-2">
            <Link href="/admin/login" className="text-sidebar-foreground/50 hover:text-primary transition-colors text-xs" data-testid="link-admin-login">
              Admin Access
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
