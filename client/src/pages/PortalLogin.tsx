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
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Gothic library background */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: "url(/archivist-hero-background.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 via-transparent to-pink-500/5"></div>

      {/* Animated grid */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(rgba(20, 184, 166, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(20, 184, 166, 0.3) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          animation: "grid-flow 20s linear infinite",
        }}
      ></div>

      <style>{`
        @keyframes grid-flow {
          0% { transform: translate(0, 0); }
          100% { transform: translate(60px, 60px); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
      `}</style>

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          {/* Logo */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 mb-6 relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-teal-500 to-pink-500 opacity-20 blur-xl animate-pulse"></div>
              <img
                src="/archivist-icon.png"
                alt="The Archivist"
                className="relative w-full h-full object-contain"
              />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-3">
              <span className="bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
                Pattern Archive
              </span>
            </h1>
            <p className="text-gray-400 text-lg">Your excavation continues</p>
          </div>

          {/* Login Card */}
          <div className="relative group">
            {/* Glow effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500 to-pink-500 rounded-2xl opacity-20 group-hover:opacity-30 blur transition-opacity"></div>

            <div className="relative bg-black/60 backdrop-blur-2xl border border-white/10 rounded-2xl p-8 md:p-10">
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-teal-500/50 rounded-tl-2xl"></div>
              <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-pink-500/50 rounded-br-2xl"></div>

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
                      />
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-teal-500/0 via-teal-500/5 to-pink-500/0 pointer-events-none"></div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="relative w-full group/btn overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-teal-500 via-cyan-500 to-teal-500 rounded-xl transition-transform group-hover/btn:scale-105"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-cyan-400 opacity-0 group-hover/btn:opacity-100 rounded-xl transition-opacity"></div>
                    <span className="relative block py-4 text-black font-bold text-lg tracking-wide">
                      {loading ? "ACCESSING ARCHIVE..." : "ENTER ARCHIVE"}
                    </span>
                  </button>
                </form>

                {message && (
                  <div className="mt-6 relative">
                    <div className="absolute inset-0 bg-teal-500/10 rounded-xl blur"></div>
                    <div className="relative p-4 bg-teal-500/5 border border-teal-500/30 rounded-xl">
                      <p className="text-teal-400 text-sm font-medium break-all">
                        {message}
                      </p>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="mt-6 relative">
                    <div className="absolute inset-0 bg-red-500/10 rounded-xl blur"></div>
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
                    className="inline-flex items-center gap-2 text-teal-400 hover:text-teal-300 font-semibold transition-colors group/link"
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

          {/* Footer hint */}
          <p className="text-center mt-8 text-gray-500 text-sm">
            Secure access · Pattern archaeology · The Archivist Method™
          </p>
        </div>
      </div>
    </div>
  );
}
