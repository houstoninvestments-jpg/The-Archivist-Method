import { useState } from "react";
import { useLocation } from "wouter";
import ParticleField from '@/components/ParticleField';

export default function PortalLogin() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [, setLocation] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/portal/auth/send-login-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send login link");
      }

      // Test users get instant access - redirect immediately
      if (data.instantAccess) {
        setMessage("Access granted. Redirecting...");
        setTimeout(() => {
          setLocation("/portal/dashboard");
        }, 1000);
        return;
      }

      // Regular users need to check email
      setMessage("Access granted. Check your email for your login link.");

      if (data.devLink) {
        setMessage(`Dev mode - ${data.devLink}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Access denied");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: '#0a0a0a' }}>
      <ParticleField />
      
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage:
            "linear-gradient(rgba(20, 184, 166, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(20, 184, 166, 0.2) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      
      {/* Radial fade overlay */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, #0a0a0a 70%)',
        }}
      />

      {/* Static ambient glow */}
      <div 
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-15 pointer-events-none" 
        style={{ background: 'radial-gradient(circle, #14B8A6 0%, transparent 70%)' }} 
      />
      <div 
        className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full opacity-10 pointer-events-none" 
        style={{ background: 'radial-gradient(circle, #EC4899 0%, transparent 70%)' }} 
      />

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          {/* Logo */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center mb-6">
              <img 
                src="/archivist-icon.png" 
                alt="The Archivist" 
                className="w-20 h-20 object-cover"
                style={{ background: 'black', borderRadius: '50%', padding: '4px' }}
              />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-3">
              <span 
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: 'linear-gradient(135deg, #14B8A6 0%, #06B6D4 100%)' }}
              >
                Pattern Archive
              </span>
            </h1>
            <p className="text-gray-400 text-lg">Your excavation continues</p>
          </div>

          {/* Login Card with Static Gradient Border */}
          <div className="relative">
            {/* Static outer glow */}
            <div 
              className="absolute -inset-1 rounded-3xl opacity-40"
              style={{ 
                background: 'linear-gradient(135deg, #EC4899 0%, #14B8A6 50%, #06B6D4 100%)',
                filter: 'blur(12px)'
              }}
            />
            
            {/* Static gradient border */}
            <div 
              className="relative rounded-3xl p-[2px]"
              style={{ background: 'linear-gradient(135deg, #EC4899 0%, #14B8A6 50%, #06B6D4 100%)' }}
            >
              {/* Glass card content */}
              <div 
                className="rounded-3xl p-8 md:p-10"
                style={{ 
                  background: 'rgba(10, 10, 10, 0.95)',
                  backdropFilter: 'blur(8px)'
                }}
              >
                {/* Corner accents */}
                <div 
                  className="absolute top-2 left-2 w-12 h-12 rounded-tl-2xl"
                  style={{ borderLeft: '2px solid rgba(20, 184, 166, 0.4)', borderTop: '2px solid rgba(20, 184, 166, 0.4)' }}
                />
                <div 
                  className="absolute bottom-2 right-2 w-12 h-12 rounded-br-2xl"
                  style={{ borderRight: '2px solid rgba(236, 72, 153, 0.4)', borderBottom: '2px solid rgba(236, 72, 153, 0.4)' }}
                />

                <div className="relative">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Welcome Back, Archivist
                  </h2>
                  <p className="text-gray-400 mb-8">
                    Access your pattern library and continue your work
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-3 tracking-wide">
                        EMAIL ACCESS
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="your@email.com"
                        className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-teal-500 transition-colors text-lg"
                        data-testid="input-email"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 rounded-xl font-bold text-lg tracking-wide text-black transition-opacity hover:opacity-90"
                      style={{ background: 'linear-gradient(135deg, #14B8A6 0%, #06B6D4 100%)' }}
                      data-testid="button-submit"
                    >
                      {loading ? "ACCESSING ARCHIVE..." : "ENTER ARCHIVE"}
                    </button>
                  </form>

                  {message && (
                    <div 
                      className="mt-6 p-4 rounded-xl"
                      style={{ background: 'rgba(20, 184, 166, 0.1)', border: '1px solid rgba(20, 184, 166, 0.3)' }}
                    >
                      <p className="text-sm font-medium break-all" style={{ color: '#14B8A6' }}>
                        {message}
                      </p>
                    </div>
                  )}

                  {error && (
                    <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                      <p className="text-red-400 text-sm font-medium">
                        {error}
                      </p>
                    </div>
                  )}

                  <div className="mt-8 pt-6 border-t border-white/10 text-center">
                    <p className="text-gray-400 text-sm mb-2">
                      No archive access yet?
                    </p>
                    <a
                      href="/#products"
                      className="inline-flex items-center gap-2 font-semibold transition-colors hover:opacity-80"
                      style={{ color: '#14B8A6' }}
                      data-testid="link-begin-excavation"
                    >
                      <span>Begin Your Excavation</span>
                      <span>→</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer hint */}
          <p className="text-center mt-8 text-gray-500 text-sm">
            Secure access · Pattern archaeology · The Archivist Method™
          </p>
        </div>
      </div>
    </div>
  );
}
