import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Shield, Loader2, AlertCircle } from "lucide-react";
import { setAuthState } from "@/lib/auth";
import { apiRequest } from "@/lib/queryClient";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await apiRequest("POST", "/api/auth/login", formData);
      
      // Check if user is actually an admin
      if (result.user.role !== "admin") {
        toast({
          title: "Access Denied",
          description: "This login is for administrators only. Please use the regular login page.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      setAuthState(result.user, result.token);
      
      toast({
        title: "Welcome, Administrator",
        description: "Successfully logged into the admin panel.",
      });

      setLocation("/admin");
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Admin Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 px-4 py-3 rounded-lg bg-slate-800/50 backdrop-blur-sm border border-slate-700">
            <Shield className="h-10 w-10 text-amber-500" />
            <div className="text-left">
              <span className="block font-serif text-2xl font-bold text-white">Arcane Arc</span>
              <span className="block text-sm text-amber-500 font-semibold">Admin Panel</span>
            </div>
          </div>
        </div>

        <Alert className="mb-6 bg-amber-500/10 border-amber-500/50 text-amber-200">
          <AlertCircle className="h-4 w-4 text-amber-500" />
          <AlertDescription>
            This is a restricted area for administrators only.
          </AlertDescription>
        </Alert>

        <Card className="shadow-2xl bg-slate-800/50 backdrop-blur-sm border-slate-700">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-white">
              Administrator Login
            </CardTitle>
            <CardDescription className="text-center text-slate-400">
              Enter your admin credentials to access the control panel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-slate-200">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Admin username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                  disabled={isLoading}
                  data-testid="input-admin-username"
                  className="h-12 bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-amber-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-200">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Admin password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  disabled={isLoading}
                  data-testid="input-admin-password"
                  className="h-12 bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-amber-500"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-amber-600 hover:bg-amber-700 text-white font-semibold shadow-lg shadow-amber-500/20"
                disabled={isLoading}
                data-testid="button-admin-login"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Access Admin Panel
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-slate-400">Not an admin? </span>
              <Link 
                href="/login" 
                className="text-amber-500 hover:text-amber-400 font-medium transition-colors" 
                data-testid="link-regular-login"
              >
                User Login
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <Link 
            href="/" 
            className="text-sm text-slate-400 hover:text-white transition-colors" 
            data-testid="link-back-home"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
