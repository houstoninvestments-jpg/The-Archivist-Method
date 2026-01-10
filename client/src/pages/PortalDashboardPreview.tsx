import { Download, BookOpen, MessageCircle, Clock, Lock, ArrowRight, Sparkles } from 'lucide-react';

const archivistIcon = '/archivist-icon.png';

const previewData = {
  email: 'member@example.com',
  purchases: [
    {
      productId: 'complete-archive',
      productName: 'The Complete Archive',
      price: 197,
      purchasedAt: new Date().toISOString(),
    },
    {
      productId: 'quick-start',
      productName: 'The Quick-Start System',
      price: 47,
      purchasedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ],
  availableUpgrades: [] as { id: string; name: string; price: number; description: string }[],
};

export default function PortalDashboardPreview() {
  const userData = previewData;

  const handleDownload = (productId: string) => {
    window.location.href = '/#pricing';
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: '#050505' }}>
      {/* Dark grid background pattern */}
      <div 
        className="fixed inset-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(rgba(20, 184, 166, 0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(20, 184, 166, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />
      
      {/* Gothic texture overlay */}
      <div 
        className="fixed inset-0 opacity-40"
        style={{
          background: `
            radial-gradient(ellipse at 20% 30%, rgba(20, 184, 166, 0.05) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 70%, rgba(236, 72, 153, 0.03) 0%, transparent 50%)
          `,
        }}
      />
      
      {/* Radial vignette */}
      <div 
        className="fixed inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, #050505 75%)',
        }}
      />

      {/* Ambient glows */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] rounded-full opacity-10 pointer-events-none" style={{ background: 'radial-gradient(circle, #14B8A6 0%, transparent 60%)' }} />
      <div className="fixed bottom-0 right-1/4 w-[400px] h-[400px] rounded-full opacity-8 pointer-events-none" style={{ background: 'radial-gradient(circle, #EC4899 0%, transparent 60%)' }} />

      {/* Sticky Header */}
      <header 
        className="sticky top-0 z-50 border-b border-white/5"
        style={{ background: 'rgba(5, 5, 5, 0.85)', backdropFilter: 'blur(12px)' }}
      >
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img 
              src={archivistIcon} 
              alt="The Archivist" 
              className="w-11 h-11 object-cover"
              style={{ background: '#050505', borderRadius: '50%', padding: '2px', border: '1px solid rgba(20, 184, 166, 0.3)' }}
            />
            <div>
              <h1 
                className="text-xl font-bold bg-clip-text text-transparent"
                style={{ backgroundImage: 'linear-gradient(135deg, #14B8A6 0%, #06B6D4 100%)' }}
              >
                Pattern Archive
              </h1>
              <p className="text-gray-500 text-xs">Your excavation continues</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span 
              className="px-2 py-0.5 rounded text-[10px] font-medium tracking-wider"
              style={{ background: 'rgba(20, 184, 166, 0.1)', color: 'rgba(20, 184, 166, 0.6)', border: '1px solid rgba(20, 184, 166, 0.2)' }}
            >
              PREVIEW
            </span>
            <button
              onClick={() => window.location.href = '/#pricing'}
              className="px-5 py-2.5 rounded-lg font-semibold text-black transition-transform hover:scale-[1.02]"
              style={{ background: 'linear-gradient(135deg, #14B8A6 0%, #06B6D4 100%)', boxShadow: '0 4px 20px rgba(20, 184, 166, 0.3)' }}
              data-testid="button-get-access"
            >
              Get Full Access
            </button>
          </div>
        </div>
      </header>

      <div className="relative px-4 pb-16 pt-8">
        <div className="max-w-6xl mx-auto">

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
            {/* Days in Archive */}
            <div 
              className="rounded-xl p-[1px] transition-transform hover:scale-[1.02]"
              style={{ background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.5) 0%, rgba(6, 182, 212, 0.3) 100%)' }}
            >
              <div 
                className="rounded-xl p-5 h-full"
                style={{ 
                  background: 'rgba(5, 5, 5, 0.9)', 
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-lg" style={{ background: 'rgba(20, 184, 166, 0.1)' }}>
                    <Clock className="w-5 h-5" style={{ color: '#14B8A6' }} />
                  </div>
                  <span className="text-3xl font-bold text-white">14</span>
                </div>
                <p className="text-gray-500 text-sm font-medium">Days in Archive</p>
              </div>
            </div>

            {/* Active Systems */}
            <div 
              className="rounded-xl p-[1px] transition-transform hover:scale-[1.02]"
              style={{ background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.5) 0%, rgba(20, 184, 166, 0.3) 100%)' }}
            >
              <div 
                className="rounded-xl p-5 h-full"
                style={{ 
                  background: 'rgba(5, 5, 5, 0.9)', 
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-lg" style={{ background: 'rgba(6, 182, 212, 0.1)' }}>
                    <BookOpen className="w-5 h-5" style={{ color: '#06B6D4' }} />
                  </div>
                  <span className="text-3xl font-bold text-white">2</span>
                </div>
                <p className="text-gray-500 text-sm font-medium">Active Systems</p>
              </div>
            </div>

            {/* AI Conversations */}
            <div 
              className="rounded-xl p-[1px] transition-transform hover:scale-[1.02]"
              style={{ background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.4) 0%, rgba(20, 184, 166, 0.3) 100%)' }}
            >
              <div 
                className="rounded-xl p-5 h-full"
                style={{ 
                  background: 'rgba(5, 5, 5, 0.9)', 
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-lg" style={{ background: 'rgba(236, 72, 153, 0.1)' }}>
                    <MessageCircle className="w-5 h-5" style={{ color: '#EC4899' }} />
                  </div>
                  <span className="text-3xl font-bold text-white">∞</span>
                </div>
                <p className="text-gray-500 text-sm font-medium">AI Conversations</p>
              </div>
            </div>
          </div>

          {/* Talk to The Archivist AI */}
          <section className="mb-10">
            <div 
              className="rounded-2xl p-[2px] transition-transform hover:scale-[1.01]"
              style={{ background: 'linear-gradient(135deg, #14B8A6 0%, #EC4899 100%)' }}
            >
              <div 
                className="rounded-2xl p-6 md:p-8"
                style={{ 
                  background: 'rgba(5, 5, 5, 0.95)', 
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 12px 48px rgba(0, 0, 0, 0.5)'
                }}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <div className="flex items-start gap-4">
                    <div 
                      className="p-3 rounded-xl flex-shrink-0"
                      style={{ background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.15) 0%, rgba(236, 72, 153, 0.15) 100%)' }}
                    >
                      <Sparkles className="w-7 h-7" style={{ color: '#14B8A6' }} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">Talk to The Archivist AI</h3>
                      <p className="text-gray-400 text-sm">Need help identifying your patterns? Get personalized guidance from our AI trained on the complete pattern library.</p>
                    </div>
                  </div>
                  <button
                    onClick={() => window.location.href = '/#pricing'}
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-black transition-transform hover:scale-[1.02] flex-shrink-0"
                    style={{ 
                      background: 'linear-gradient(135deg, #14B8A6 0%, #06B6D4 100%)',
                      boxShadow: '0 4px 20px rgba(20, 184, 166, 0.3)'
                    }}
                    data-testid="button-start-conversation"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>Start Conversation</span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Your Pattern Systems */}
          <section className="mb-10">
            <h3 className="text-xl font-bold text-white mb-5 flex items-center gap-3">
              <span className="w-1 h-6 rounded-full" style={{ background: 'linear-gradient(180deg, #14B8A6 0%, #06B6D4 100%)' }} />
              Your Pattern Systems
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {userData.purchases.map((purchase) => (
                <div 
                  key={purchase.productId} 
                  className="rounded-xl p-[1px] transition-transform hover:scale-[1.02]"
                  style={{ background: 'linear-gradient(135deg, #14B8A6 0%, #06B6D4 100%)' }}
                >
                  <div 
                    className="rounded-xl p-5 h-full"
                    style={{ 
                      background: 'rgba(5, 5, 5, 0.95)', 
                      backdropFilter: 'blur(10px)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
                    }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div 
                          className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full mb-3"
                          style={{ background: 'rgba(20, 184, 166, 0.1)', border: '1px solid rgba(20, 184, 166, 0.25)' }}
                        >
                          <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#14B8A6' }} />
                          <span className="text-[10px] font-bold tracking-widest" style={{ color: '#14B8A6' }}>ACTIVE</span>
                        </div>
                        <h4 className="text-lg font-bold text-white mb-1">{purchase.productName}</h4>
                        <p className="text-xs text-gray-500">
                          ${purchase.price} · Unlocked {new Date(purchase.purchasedAt).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </p>
                      </div>
                      <div className="p-2.5 rounded-lg" style={{ background: 'rgba(20, 184, 166, 0.08)' }}>
                        <BookOpen className="w-5 h-5" style={{ color: '#14B8A6' }} />
                      </div>
                    </div>

                    <button
                      onClick={() => handleDownload(purchase.productId)}
                      className="w-full mt-3 px-4 py-2.5 rounded-lg font-semibold text-black transition-transform hover:scale-[1.02] flex items-center justify-center gap-2 text-sm"
                      style={{ 
                        background: 'linear-gradient(135deg, #14B8A6 0%, #06B6D4 100%)',
                        boxShadow: '0 4px 16px rgba(20, 184, 166, 0.25)'
                      }}
                      data-testid={`button-download-${purchase.productId}`}
                    >
                      <Download className="w-4 h-4" />
                      <span>Download System</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Expand Your Archive - only show if there are upgrades */}
          {userData.availableUpgrades.length > 0 && (
            <section>
              <h3 className="text-xl font-bold text-white mb-5 flex items-center gap-3">
                <span className="w-1 h-6 rounded-full" style={{ background: 'linear-gradient(180deg, #EC4899 0%, #F472B6 100%)' }} />
                Expand Your Archive
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {userData.availableUpgrades.map((upgrade) => (
                  <div 
                    key={upgrade.id} 
                    className="rounded-xl p-[1px] transition-transform hover:scale-[1.02]"
                    style={{ background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.5) 0%, rgba(244, 114, 182, 0.3) 100%)' }}
                  >
                    <div 
                      className="rounded-xl p-5 h-full"
                      style={{ 
                        background: 'rgba(5, 5, 5, 0.95)', 
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
                      }}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div 
                            className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full mb-3"
                            style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)' }}
                          >
                            <Lock className="w-3 h-3 text-gray-500" />
                            <span className="text-[10px] font-bold tracking-widest text-gray-500">LOCKED</span>
                          </div>
                          <h4 className="text-lg font-bold text-white mb-2">{upgrade.name}</h4>
                          <p className="text-xs text-gray-500 mb-3">{upgrade.description}</p>
                          <div 
                            className="text-2xl font-bold bg-clip-text text-transparent"
                            style={{ backgroundImage: 'linear-gradient(135deg, #EC4899 0%, #F472B6 100%)' }}
                          >
                            ${upgrade.price}
                          </div>
                        </div>
                        <div className="p-2.5 rounded-lg" style={{ background: 'rgba(236, 72, 153, 0.08)' }}>
                          <Lock className="w-5 h-5" style={{ color: '#EC4899' }} />
                        </div>
                      </div>
                      <button
                        onClick={() => window.location.href = "/#pricing"}
                        className="w-full mt-3 px-4 py-2.5 rounded-lg font-semibold transition-transform hover:scale-[1.02] flex items-center justify-center gap-2 text-sm"
                        style={{ background: 'rgba(236, 72, 153, 0.1)', border: '1px solid rgba(236, 72, 153, 0.25)', color: '#EC4899' }}
                        data-testid={`button-unlock-${upgrade.id}`}
                      >
                        <span>Unlock System</span>
                        <ArrowRight className="w-4 h-4" />
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
