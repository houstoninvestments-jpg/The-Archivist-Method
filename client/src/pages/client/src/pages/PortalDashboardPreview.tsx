export default function PortalDashboardPreview() {
  const userData = {
    email: "preview@example.com",
    purchases: [
      {
        productId: "quick-start",
        productName: "Quick-Start System",
        purchasedAt: new Date().toISOString(),
      },
      {
        productId: "complete-archive",
        productName: "Complete Archive",
        purchasedAt: new Date().toISOString(),
      },
    ],
  };

  const daysSinceStart = 7;

  return (
    <div className="min-h-screen bg-black">
      <div className="fixed inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-transparent to-pink-500/10"></div>
      </div>

      <div className="relative">
        <header className="border-b border-white/10 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <div className="flex items-center gap-4">
                <img
                  src="/archivist-icon.png"
                  alt="The Archivist"
                  className="w-12 h-12"
                />
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                    Pattern Archive
                  </h1>
                  <p className="text-xs text-gray-500">The Archivist Method</p>
                </div>
              </div>
              <button className="px-4 py-2 text-sm text-gray-400 hover:text-white border border-white/10 hover:border-white/20 rounded-lg transition-all">
                Logout
              </button>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Welcome Back, Archivist
            </h2>
            <p className="text-gray-400 text-lg">{userData.email}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 to-cyan-500/20 rounded-xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <svg
                    className="w-8 h-8 text-teal-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                  <span className="text-3xl font-bold text-white">
                    {daysSinceStart}
                  </span>
                </div>
                <p className="text-gray-400 font-medium">Days in Archive</p>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <svg
                    className="w-8 h-8 text-cyan-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                  <span className="text-3xl font-bold text-white">
                    {userData.purchases.length}
                  </span>
                </div>
                <p className="text-gray-400 font-medium">Active Systems</p>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <svg
                    className="w-8 h-8 text-pink-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  <span className="text-3xl font-bold text-white">∞</span>
                </div>
                <p className="text-gray-400 font-medium">AI Conversations</p>
              </div>
            </div>
          </div>

          <section className="mb-12">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="w-1 h-8 bg-gradient-to-b from-teal-500 to-cyan-500 rounded-full"></span>
              Your Pattern Systems
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {userData.purchases.map((purchase) => (
                <div key={purchase.productId} className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-cyan-500/10 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative bg-white/5 backdrop-blur-xl border border-teal-500/30 rounded-xl p-6 hover:border-teal-500/50 transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="inline-block px-3 py-1 bg-teal-500/20 border border-teal-500/30 rounded-full mb-3">
                          <span className="text-xs font-bold text-teal-400 tracking-wide">
                            ACTIVE
                          </span>
                        </div>
                        <h4 className="text-xl font-bold text-white mb-1">
                          {purchase.productName}
                        </h4>
                        <p className="text-sm text-gray-400">
                          Unlocked{" "}
                          {new Date(purchase.purchasedAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            },
                          )}
                        </p>
                      </div>
                      <svg
                        className="w-8 h-8 text-teal-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                      </svg>
                    </div>

                    <button className="w-full mt-4 px-4 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 rounded-lg text-black font-semibold transition-all flex items-center justify-center gap-2">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                      <span>Download System</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
