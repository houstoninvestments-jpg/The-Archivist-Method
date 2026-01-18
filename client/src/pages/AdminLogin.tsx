import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Shield, Eye, EyeOff, Clock } from "lucide-react";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showTimeoutMessage, setShowTimeoutMessage] = useState(false);
  const [location, setLocation] = useLocation();
  const { toast } = useToast();

  // Check for timeout redirect
  useEffect(() => {
    const params = new URLSearchParams(location.split('?')[1] || '');
    if (params.get('reason') === 'timeout') {
      setShowTimeoutMessage(true);
      // Clean up URL
      window.history.replaceState({}, '', '/admin');
    }
  }, [location]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast({
          title: "Error",
          description: data.error || "Login failed",
          variant: "destructive",
        });
        return;
      }

      localStorage.setItem("adminToken", data.token);
      setLocation("/admin/dashboard");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to connect to server",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-[#1a1a1a] border-[#333333]">
        <CardHeader className="text-center space-y-4">
          {showTimeoutMessage && (
            <div className="flex items-center gap-2 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-yellow-400 text-sm">
              <Clock className="w-4 h-4 flex-shrink-0" />
              <span>Session expired due to inactivity. Please log in again.</span>
            </div>
          )}
          <div className="mx-auto w-16 h-16 rounded-full bg-[#14B8A6]/10 flex items-center justify-center">
            <Shield className="w-8 h-8 text-[#14B8A6]" />
          </div>
          <CardTitle className="text-2xl text-white font-['Inter']">
            Admin Panel
          </CardTitle>
          <p className="text-[#9ca3af] text-sm">
            Enter password to access test user management
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-[#0a0a0a] border-[#333333] text-white pr-12"
                data-testid="input-admin-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-white transition-colors"
                data-testid="button-toggle-password"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <Button
              type="submit"
              disabled={isLoading || !password}
              className="w-full bg-[#14B8A6] hover:bg-[#0d9488] text-white"
              data-testid="button-admin-login"
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
