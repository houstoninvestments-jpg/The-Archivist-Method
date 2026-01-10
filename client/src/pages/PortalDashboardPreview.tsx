import { Download, BookOpen, MessageCircle, Clock, Lock, ArrowRight } from 'lucide-react';
import archivistIcon from '@assets/archivist-icon.png';

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
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Gothic library background */}
      <div 
        className="fixed inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2300FFC8' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      
      {/* Gradient overlays */}
      <div className="fixed inset-0 bg-gradient-to-b from-black via-transparent to-black pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-to-r from-teal-900/20 via-transparent to-cyan-900/20 pointer-events-none" />

      {/* Preview Mode Banner */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-teal-500/30">
        <div className="flex items-center justify-center gap-4 py-2 px-4">
          <span className="px-3 py-1 bg-teal-500/20 border border-teal-500/40 rounded-full text-xs font-bold text-teal-400 tracking-widest">
            PREVIEW MODE
          </span>
          <span className="text-gray-400 text-sm">
            Experience the member portal before you join
          </span>
          <a 
            href="/#pricing" 
            className="text-teal-400 hover:text-teal-300 text-sm font-semibold underline transition-colors"
          >
            Get Full Access →
          </a>
        </div>
      </div>

      <div className="relative pt-20 px-4 pb-12">
        <div className="max-w-6xl mx-auto">
          {/* Header with Logo */}
          <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12 pt-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-teal-500/30 blur-xl rounded-full" />
                <img 
                  src={archivistIcon} 
                  alt="The Archivist" 
                  className="relative w-16 h-16 object-contain"
                />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-300 bg-clip-text text-transparent">
                  Pattern Archive
                </h1>
                <p className="text-gray-500 text-sm mt-1">Member Portal Preview</p>
              </div>
            </div>
            <button
              onClick={() => window.location.href = '/#pricing'}
              className="px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 rounded-lg text-black font-semibold transition-all shadow-lg shadow-teal-500/25"
              data-testid="button-get-access"
            >
              Get Full Access
            </button>
          </header>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 to-cyan-500/20 rounded-xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity" />
              <div className="relative bg-white/5 backdrop-blur-xl border border-teal-500/20 rounded-xl p-6 hover:border-teal-500/40 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <Clock className="w-8 h-8 text-teal-400" />
                  <span className="text-3xl font-bold text-white">7</span>
                </div>
                <p className="text-gray-400 font-medium">Days in Archive</p>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-teal-500/20 rounded-xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity" />
              <div className="relative bg-white/5 backdrop-blur-xl border border-cyan-500/20 rounded-xl p-6 hover:border-cyan-500/40 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <BookOpen className="w-8 h-8 text-cyan-400" />
                  <span className="text-3xl font-bold text-white">2</span>
                </div>
                <p className="text-gray-400 font-medium">Active Systems</p>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 to-cyan-500/20 rounded-xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity" />
              <div className="relative bg-white/5 backdrop-blur-xl border border-teal-500/20 rounded-xl p-6 hover:border-teal-500/40 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <MessageCircle className="w-8 h-8 text-teal-400" />
                  <span className="text-3xl font-bold text-white">∞</span>
                </div>
                <p className="text-gray-400 font-medium">AI Conversations</p>
              </div>
            </div>
          </div>

          {/* Your Pattern Systems */}
          <section className="mb-12">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="w-1 h-8 bg-gradient-to-b from-teal-500 to-cyan-500 rounded-full" />
              Your Pattern Systems
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {userData.purchases.map((purchase) => (
                <div key={purchase.productId} className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-cyan-500/10 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative bg-white/5 backdrop-blur-xl border border-teal-500/30 rounded-xl p-6 hover:border-teal-500/50 transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="inline-block px-3 py-1 bg-teal-500/20 border border-teal-500/30 rounded-full mb-3">
                          <span className="text-xs font-bold text-teal-400 tracking-widest">ACTIVE</span>
                        </div>
                        <h4 className="text-xl font-bold text-white mb-1">{purchase.productName}</h4>
                        <p className="text-sm text-gray-500">
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
                      className="w-full mt-4 px-4 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 rounded-lg text-black font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20"
                      data-testid={`button-download-${purchase.productId}`}
                    >
                      <Download className="w-5 h-5" />
                      <span>Download System</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Expand Your Archive */}
          {userData.availableUpgrades.length > 0 && (
            <section>
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="w-1 h-8 bg-gradient-to-b from-gray-600 to-gray-700 rounded-full" />
                Expand Your Archive
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {userData.availableUpgrades.map((upgrade) => (
                  <div key={upgrade.id} className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-500/5 to-gray-600/5 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:border-teal-500/20 transition-all">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded-full mb-3">
                            <span className="text-xs font-bold text-gray-500 tracking-widest">LOCKED</span>
                          </div>
                          <h4 className="text-xl font-bold text-white mb-2">{upgrade.name}</h4>
                          <p className="text-sm text-gray-500 mb-4">{upgrade.description}</p>
                          <div className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                            ${upgrade.price}
                          </div>
                        </div>
                        <Lock className="w-8 h-8 text-gray-600" />
                      </div>
                      <button
                        onClick={() => window.location.href = "/#pricing"}
                        className="w-full mt-4 px-4 py-3 bg-gradient-to-r from-teal-500/10 to-cyan-500/10 hover:from-teal-500/20 hover:to-cyan-500/20 border border-teal-500/30 rounded-lg text-teal-400 font-semibold transition-all flex items-center justify-center gap-2"
                        data-testid={`button-unlock-${upgrade.id}`}
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
