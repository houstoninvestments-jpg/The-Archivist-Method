import { useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
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
          title: "Access denied",
          description: data.error || "Invalid credentials",
          variant: "destructive",
        });
        return;
      }

      localStorage.setItem("adminToken", data.token);
      setLocation("/admin/dashboard");
    } catch {
      toast({
        title: "Connection error",
        description: "Could not reach the server",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "#0A0A0A" }}
    >
      <div className="w-full" style={{ maxWidth: "400px" }}>
        <div
          className="p-8"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "4px",
          }}
        >
          <h1
            className="text-center mb-8"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "1.1rem",
              letterSpacing: "0.2em",
              color: "#14B8A6",
              textTransform: "uppercase",
            }}
            data-testid="text-admin-title"
          >
            ADMIN
          </h1>

          <form onSubmit={handleLogin} className="space-y-6">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              className="w-full px-4 py-3 outline-none"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "2px",
                color: "#F5F5F5",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.875rem",
              }}
              data-testid="input-admin-password"
            />

            <button
              type="submit"
              disabled={isLoading || !password}
              className="w-full py-3 transition-all"
              style={{
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "2px",
                color: "#F5F5F5",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.8rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                opacity: isLoading || !password ? 0.4 : 1,
                cursor: isLoading || !password ? "not-allowed" : "pointer",
              }}
              data-testid="button-admin-login"
            >
              {isLoading ? "..." : "Enter"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
