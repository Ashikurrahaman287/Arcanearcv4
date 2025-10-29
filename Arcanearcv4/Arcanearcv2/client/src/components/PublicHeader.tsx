import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { Menu, X, Snowflake, Shield } from "lucide-react";
import { useState, useEffect } from "react";

export function PublicHeader() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/program", label: "Program" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-md border-b border-border shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover-elevate rounded-lg px-2 py-1 -ml-2" data-testid="link-home">
            <Snowflake className="h-8 w-8 text-primary" />
            <span className="font-serif text-xl font-bold">Arcane Arc</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors hover-elevate ${
                  location === link.href
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
                data-testid={`link-${link.label.toLowerCase()}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle />
            <Link href="/admin/login">
              <Button variant="outline" data-testid="button-admin-login" className="hover-elevate active-elevate-2 border-amber-500/50 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 hover:border-amber-500" asChild>
                <span className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Admin
                </span>
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="ghost" data-testid="button-login" className="hover-elevate active-elevate-2" asChild>
                <span>Login</span>
              </Button>
            </Link>
            <Link href="/signup">
              <Button data-testid="button-signup-header" className="hover-elevate active-elevate-2" asChild>
                <span>Join Program</span>
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-mobile-menu"
              className="hover-elevate active-elevate-2"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-md">
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className={`block px-4 py-2 rounded-lg text-sm font-medium transition-colors hover-elevate ${
                  location === link.href
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground"
                }`}
                onClick={() => setMobileMenuOpen(false)}
                data-testid={`link-mobile-${link.label.toLowerCase()}`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-border space-y-2">
              <Link href="/admin/login" onClick={() => setMobileMenuOpen(false)} className="block">
                <Button variant="outline" className="w-full hover-elevate active-elevate-2 border-amber-500/50 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 hover:border-amber-500" data-testid="button-mobile-admin-login">
                  <Shield className="h-4 w-4 mr-2" />
                  Admin Login
                </Button>
              </Link>
              <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="block">
                <Button variant="ghost" className="w-full hover-elevate active-elevate-2" data-testid="button-mobile-login">
                  Login
                </Button>
              </Link>
              <Link href="/signup" onClick={() => setMobileMenuOpen(false)} className="block">
                <Button className="w-full hover-elevate active-elevate-2" data-testid="button-mobile-signup">
                  Join Program
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
