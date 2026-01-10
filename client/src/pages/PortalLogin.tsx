import { useState } from "react";

export default function PortalLogin() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

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

      setMessage("Access granted. Check your email.");

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
      <style>{`
        @keyframes rotate-border {
          0% { --angle: 0deg; }
          100% { --angle: 360deg; }
        }
        
        @keyframes glow-pulse {
          0%, 100% { 
            opacity: 0.4;
            transform: scale(1);
          }
          50% { 
            opacity: 0.8;
            transform: scale(1.02);
          }
        }
        
        @keyframes grid-flow {
          0% { transform: translate(0, 0); }
          100% { transform: translate(60px, 60px); }
        }
        
        .animate-border-card {
          position: relative;
          border-radius: 24px;
        }
        
        .animate-border-card::before {
          content: '';
          position: absolute;
          inset: 0;
          padding: 2px;
          border-radius: 24px;
          background: conic-gradient(from var(--angle, 0deg), #EC4899, #14B8A6, #06B6D4, #EC4899);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          animation: rotate-border 4s linear infinite;
        }
        
        .outer-glow {
          position: absolute;
          inset: -4px;
          border-radius: 28px;
          background: conic-gradient(from var(--angle, 0deg), #EC4899, #14B8A6, #06B6D4, #EC4899);
          filter: blur(20px);
          opacity: 0.5;
          animation: rotate-border 4s linear infinite, glow-pulse 3s ease-in-out infinite;
          z-index: -1;
        }
        
        .glass-card {
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
        }

        @property --angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
      `}</style>

      {/* Grid background with radial fade */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(rgba(20, 184, 166, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(20, 184, 166, 0.15) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          animation: "grid-flow 20s linear infinite",
        }}
      />
      
      {/* Radial fade overlay */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, #0a0a0a 70%)',
        }}
      />

      {/* Ambient glow effects */}
      <div 
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none" 
        style={{ background: 'radial-gradient(circle, #14B8A6 0%, transparent 70%)' }} 
      />
      <div 
        className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full opacity-15 blur-3xl pointer-events-none" 
        style={{ background: 'radial-gradient(circle, #EC4899 0%, transparent 70%)' }} 
      />

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          {/* Logo */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center mb-6 relative">
              <div 
                className="absolute inset-0 rounded-full blur-xl animate-pulse"
                style={{ background: 'radial-gradient(circle, rgba(20, 184, 166, 0.4) 0%, transparent 70%)' }}
              />
              <div className="w-20 h-20 rounded-full overflow-hidden" style={{ background: 'transparent' }}>
                <img 
                  src="/archivist-icon.png" 
                  alt="The Archivist" 
                  className="w-full h-full object-cover"
                  style={{ 
                    mixBlendMode: 'lighten',
                    filter: 'drop-shadow(0 0 20px rgba(20, 184, 166, 0.5))'
                  }}
                />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-3">
              <span 
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: 'linear-gradient(135deg, #14B8A6 0%, #06B6D4 50%, #14B8A6 100%)' }}
              >
                Pattern Archive
              </span>
            </h1>
            <p className="text-gray-400 text-lg">Your excavation continues</p>
          </div>

          {/* Login Card with Animated Border */}
          <div className="relative">
            {/* Outer pulsing glow */}
            <div className="outer-glow" />
            
            {/* Animated border wrapper */}
            <div className="animate-border-card">
              {/* Glass card content */}
              <div className="glass-card rounded-3xl p-8 md:p-10 border border-white/5">
                {/* Corner accents */}
                <div 
                  className="absolute top-0 left-0 w-16 h-16 rounded-tl-3xl"
                  style={{ borderLeft: '2px solid rgba(20, 184, 166, 0.5)', borderTop: '2px solid rgba(20, 184, 166, 0.5)' }}
                />
                <div 
                  className="absolute bottom-0 right-0 w-16 h-16 rounded-br-3xl"
                  style={{ borderRight: '2px solid rgba(236, 72, 153, 0.5)', borderBottom: '2px solid rgba(236, 72, 153, 0.5)' }}
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
                      <div className="relative">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          placeholder="your@email.com"
                          className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-teal-500 focus:bg-white/10 transition-all text-lg"
                          data-testid="input-email"
                        />
                        <div 
                          className="absolute inset-0 rounded-xl pointer-events-none"
                          style={{ background: 'linear-gradient(90deg, rgba(20, 184, 166, 0) 0%, rgba(20, 184, 166, 0.05) 50%, rgba(236, 72, 153, 0) 100%)' }}
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="relative w-full group/btn overflow-hidden rounded-xl"
                      data-testid="button-submit"
                    >
                      <div 
                        className="absolute inset-0 rounded-xl transition-transform group-hover/btn:scale-105"
                        style={{ background: 'linear-gradient(135deg, #14B8A6 0%, #06B6D4 100%)' }}
                      />
                      <div 
                        className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 rounded-xl transition-opacity"
                        style={{ background: 'linear-gradient(135deg, #0D9488 0%, #0891B2 100%)' }}
                      />
                      <span className="relative block py-4 text-black font-bold text-lg tracking-wide">
                        {loading ? "ACCESSING ARCHIVE..." : "ENTER ARCHIVE"}
                      </span>
                    </button>
                  </form>

                  {message && (
                    <div className="mt-6 relative">
                      <div 
                        className="absolute inset-0 rounded-xl blur"
                        style={{ background: 'rgba(20, 184, 166, 0.1)' }}
                      />
                      <div 
                        className="relative p-4 rounded-xl"
                        style={{ background: 'rgba(20, 184, 166, 0.05)', border: '1px solid rgba(20, 184, 166, 0.3)' }}
                      >
                        <p className="text-sm font-medium break-all" style={{ color: '#14B8A6' }}>
                          {message}
                        </p>
                      </div>
                    </div>
                  )}

                  {error && (
                    <div className="mt-6 relative">
                      <div className="absolute inset-0 bg-red-500/10 rounded-xl blur" />
                      <div className="relative p-4 bg-red-500/5 border border-red-500/30 rounded-xl">
                        <p className="text-red-400 text-sm font-medium">
                          {error}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="mt-8 pt-6 border-t border-white/5 text-center">
                    <p className="text-gray-400 text-sm mb-2">
                      No archive access yet?
                    </p>
                    <a
                      href="/#products"
                      className="inline-flex items-center gap-2 font-semibold transition-colors group/link"
                      style={{ color: '#14B8A6' }}
                      data-testid="link-begin-excavation"
                    >
                      <span>Begin Your Excavation</span>
                      <span className="group-hover/link:translate-x-1 transition-transform">
                        →
                      </span>
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
