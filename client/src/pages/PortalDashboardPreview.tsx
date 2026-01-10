import { Download, BookOpen, MessageCircle, TrendingUp, Lock, ArrowRight } from 'lucide-react';

const previewData = {
  email: 'preview@example.com',
  purchases: [
    {
      productId: 'quick-start',
      productName: 'The Quick-Start System',
      purchasedAt: new Date().toISOString(),
    },
  ],
  availableUpgrades: [
    {
      id: 'complete-archive',
      name: 'The Complete Archive',
      price: 197,
      description: 'Full 685-page system with advanced pattern combinations and lifetime updates.',
    },
  ],
};

export default function PortalDashboardPreview() {
  const userData = previewData;

  const handleDownload = (productId: string) => {
    window.location.href = '/#pricing';
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-center py-2 px-4">
        <span className="font-semibold">Preview Mode</span> — This is a demo of the member portal. 
        <a href="/#pricing" className="underline ml-2 font-bold">Get Access Now</a>
      </div>

      <div className="pt-16 px-4 pb-12">
        <div className="max-w-6xl mx-auto">
          <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-12 pt-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                The Archivist Method
              </h1>
              <p className="text-gray-400">{userData.email}</p>
            </div>
            <button
              onClick={() => window.location.href = '/#pricing'}
              className="px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg text-black font-semibold"
            >
              Get Full Access
            </button>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 to-cyan-500/20 rounded-xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <TrendingUp className="w-8 h-8 text-teal-400" />
                  <span className="text-3xl font-bold text-white">7</span>
                </div>
                <p className="text-gray-400 font-medium">Patterns Mapped</p>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <BookOpen className="w-8 h-8 text-cyan-400" />
                  <span className="text-3xl font-bold text-white">{userData.purchases.length}</span>
                </div>
                <p className="text-gray-400 font-medium">Active Systems</p>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <MessageCircle className="w-8 h-8 text-pink-400" />
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
                          <span className="text-xs font-bold text-teal-400 tracking-wide">ACTIVE</span>
                        </div>
                        <h4 className="text-xl font-bold text-white mb-1">{purchase.productName}</h4>
                        <p className="text-sm text-gray-400">
                          Unlocked {new Date(purchase.purchasedAt).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </p>
                      </div>
                      <BookOpen className="w-8 h-8 text-teal-400" />
                    </div>

                    <button
                      onClick={() => handleDownload(purchase.productId)}
                      className="w-full mt-4 px-4 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 rounded-lg text-black font-semibold transition-all flex items-center justify-center gap-2"
                    >
                      <Download className="w-5 h-5" />
                      <span>Download System</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {userData.availableUpgrades.length > 0 && (
            <section>
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="w-1 h-8 bg-gradient-to-b from-pink-500 to-purple-500 rounded-full"></span>
                Expand Your Archive
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {userData.availableUpgrades.map((upgrade) => (
                  <div key={upgrade.id} className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-purple-500/10 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:border-pink-500/30 transition-all">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="inline-block px-3 py-1 bg-white/10 border border-white/20 rounded-full mb-3">
                            <span className="text-xs font-bold text-gray-400 tracking-wide">LOCKED</span>
                          </div>
                          <h4 className="text-xl font-bold text-white mb-2">{upgrade.name}</h4>
                          <p className="text-sm text-gray-400 mb-4">{upgrade.description}</p>
                          <div className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                            ${upgrade.price}
                          </div>
                        </div>
                        <Lock className="w-8 h-8 text-gray-600" />
                      </div>
                      <button
                        onClick={() => window.location.href = "/#pricing"}
                        className="w-full mt-4 px-4 py-3 bg-gradient-to-r from-pink-500/20 to-purple-500/20 hover:from-pink-500/30 hover:to-purple-500/30 border border-pink-500/30 rounded-lg text-pink-400 font-semibold transition-all flex items-center justify-center gap-2"
                      >
                        <span>Unlock System</span>
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
