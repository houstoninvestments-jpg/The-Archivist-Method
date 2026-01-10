import { Download, BookOpen, MessageCircle, Clock, Lock, ArrowRight } from 'lucide-react';
const archivistIcon = '/archivist-icon.png';

const previewData = {
  email: 'preview@example.com',
  purchases: [
    {
      productId: 'quick-start',
      productName: 'The Quick-Start System',
      purchasedAt: new Date().toISOString(),
    },
    {
      productId: 'free-course',
      productName: '7-Day Pattern Course',
      purchasedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
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
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: '#0a0a0a' }}>
      <style>{`
        @keyframes rotate-border {
          0% { --angle: 0deg; }
          100% { --angle: 360deg; }
        }
        
        @keyframes glow-pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        
        .animate-border {
          position: relative;
          border-radius: 16px;
          overflow: hidden;
        }
        
        .animate-border::before {
          content: '';
          position: absolute;
          inset: 0;
          padding: 2px;
          border-radius: 16px;
          background: conic-gradient(from var(--angle, 0deg), #14B8A6, #06B6D4, #EC4899, #14B8A6);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          animation: rotate-border 4s linear infinite;
        }
        
        .animate-border-slow::before {
          animation: rotate-border 6s linear infinite;
        }
        
        .glow-teal {
          box-shadow: 0 0 40px rgba(20, 184, 166, 0.3), 0 0 80px rgba(6, 182, 212, 0.2);
        }
        
        .glow-pink {
          box-shadow: 0 0 40px rgba(236, 72, 153, 0.3), 0 0 80px rgba(236, 72, 153, 0.2);
        }
        
        .glass-card {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
        
        .gradient-text-teal {
          background: linear-gradient(135deg, #14B8A6 0%, #06B6D4 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .gradient-text-pink {
          background: linear-gradient(135deg, #EC4899 0%, #F472B6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        @property --angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
      `}</style>

      {/* Gothic grid background with radial fade */}
      <div 
        className="fixed inset-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(rgba(20, 184, 166, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(20, 184, 166, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
      <div 
        className="fixed inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, #0a0a0a 70%)',
        }}
      />

      {/* Ambient glow effects */}
      <div className="fixed top-0 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl" style={{ background: 'radial-gradient(circle, #14B8A6 0%, transparent 70%)' }} />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 rounded-full opacity-15 blur-3xl" style={{ background: 'radial-gradient(circle, #EC4899 0%, transparent 70%)' }} />

      {/* Sticky Header */}
      <header className="sticky top-0 z-50 glass-card border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 rounded-full blur-xl opacity-60" style={{ background: 'radial-gradient(circle, #14B8A6 0%, transparent 70%)' }} />
              <img 
                src={archivistIcon} 
                alt="The Archivist" 
                className="relative w-12 h-12 object-contain"
                style={{ mixBlendMode: 'screen' }}
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-text-teal">
                Pattern Archive
              </h1>
              <p className="text-gray-600 text-xs tracking-wider">PREVIEW MODE</p>
            </div>
          </div>
          <button
            onClick={() => window.location.href = '/#pricing'}
            className="px-5 py-2.5 rounded-lg font-semibold text-black transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #14B8A6 0%, #06B6D4 100%)' }}
            data-testid="button-get-access"
          >
            Get Full Access
          </button>
        </div>
      </header>

      <div className="relative px-4 pb-16 pt-8">
        <div className="max-w-6xl mx-auto">

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Days in Archive */}
            <div className="animate-border glow-teal">
              <div className="glass-card rounded-2xl p-6 h-full">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl" style={{ background: 'rgba(20, 184, 166, 0.15)' }}>
                    <Clock className="w-6 h-6" style={{ color: '#14B8A6' }} />
                  </div>
                  <span className="text-4xl font-bold text-white">7</span>
                </div>
                <p className="text-gray-400 font-medium">Days in Archive</p>
              </div>
            </div>

            {/* Active Systems */}
            <div className="animate-border glow-teal">
              <div className="glass-card rounded-2xl p-6 h-full">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl" style={{ background: 'rgba(6, 182, 212, 0.15)' }}>
                    <BookOpen className="w-6 h-6" style={{ color: '#06B6D4' }} />
                  </div>
                  <span className="text-4xl font-bold text-white">2</span>
                </div>
                <p className="text-gray-400 font-medium">Active Systems</p>
              </div>
            </div>

            {/* AI Conversations */}
            <div className="animate-border glow-teal">
              <div className="glass-card rounded-2xl p-6 h-full">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl" style={{ background: 'rgba(236, 72, 153, 0.15)' }}>
                    <MessageCircle className="w-6 h-6" style={{ color: '#EC4899' }} />
                  </div>
                  <span className="text-4xl font-bold text-white">∞</span>
                </div>
                <p className="text-gray-400 font-medium">AI Conversations</p>
              </div>
            </div>
          </div>

          {/* Your Pattern Systems */}
          <section className="mb-12">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="w-1.5 h-8 rounded-full" style={{ background: 'linear-gradient(180deg, #14B8A6 0%, #06B6D4 100%)' }} />
              Your Pattern Systems
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {userData.purchases.map((purchase, index) => (
                <div key={purchase.productId} className="animate-border animate-border-slow glow-teal">
                  <div className="glass-card rounded-2xl p-6 h-full">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div 
                          className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-3"
                          style={{ 
                            background: 'rgba(20, 184, 166, 0.15)',
                            border: '1px solid rgba(20, 184, 166, 0.3)'
                          }}
                        >
                          <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#14B8A6' }} />
                          <span className="text-xs font-bold tracking-widest" style={{ color: '#14B8A6' }}>ACTIVE</span>
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
                      <div className="p-3 rounded-xl" style={{ background: 'rgba(20, 184, 166, 0.1)' }}>
                        <BookOpen className="w-6 h-6" style={{ color: '#14B8A6' }} />
                      </div>
                    </div>

                    <button
                      onClick={() => handleDownload(purchase.productId)}
                      className="w-full mt-4 px-4 py-3 rounded-xl font-semibold text-black transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                      style={{ 
                        background: 'linear-gradient(135deg, #14B8A6 0%, #06B6D4 100%)',
                        boxShadow: '0 10px 40px rgba(20, 184, 166, 0.3)'
                      }}
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
                <span className="w-1.5 h-8 rounded-full" style={{ background: 'linear-gradient(180deg, #EC4899 0%, #F472B6 100%)' }} />
                Expand Your Archive
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {userData.availableUpgrades.map((upgrade) => (
                  <div key={upgrade.id} className="animate-border glow-pink">
                    <div className="glass-card rounded-2xl p-6 h-full">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div 
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-3"
                            style={{ 
                              background: 'rgba(255, 255, 255, 0.05)',
                              border: '1px solid rgba(255, 255, 255, 0.1)'
                            }}
                          >
                            <Lock className="w-3 h-3 text-gray-500" />
                            <span className="text-xs font-bold tracking-widest text-gray-500">LOCKED</span>
                          </div>
                          <h4 className="text-xl font-bold text-white mb-2">{upgrade.name}</h4>
                          <p className="text-sm text-gray-500 mb-4">{upgrade.description}</p>
                          <div className="text-3xl font-bold gradient-text-pink">
                            ${upgrade.price}
                          </div>
                        </div>
                        <div className="p-3 rounded-xl" style={{ background: 'rgba(236, 72, 153, 0.1)' }}>
                          <Lock className="w-6 h-6" style={{ color: '#EC4899' }} />
                        </div>
                      </div>
                      <button
                        onClick={() => window.location.href = "/#pricing"}
                        className="w-full mt-4 px-4 py-3 rounded-xl font-semibold transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                        style={{ 
                          background: 'rgba(236, 72, 153, 0.1)',
                          border: '1px solid rgba(236, 72, 153, 0.3)',
                          color: '#EC4899'
                        }}
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
