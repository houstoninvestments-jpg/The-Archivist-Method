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
      {/* Grid background */}
      <div 
        className="fixed inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(20, 184, 166, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(20, 184, 166, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
      
      {/* Radial fade */}
      <div 
        className="fixed inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, #0a0a0a 70%)',
        }}
      />

      {/* Static ambient glow */}
      <div className="fixed top-0 left-1/4 w-96 h-96 rounded-full opacity-15" style={{ background: 'radial-gradient(circle, #14B8A6 0%, transparent 70%)' }} />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #EC4899 0%, transparent 70%)' }} />

      {/* Sticky Header */}
      <header 
        className="sticky top-0 z-50 border-b border-white/10"
        style={{ background: 'rgba(10, 10, 10, 0.9)', backdropFilter: 'blur(8px)' }}
      >
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img 
              src={archivistIcon} 
              alt="The Archivist" 
              className="w-10 h-10 object-cover"
              style={{ background: 'black', borderRadius: '50%', padding: '2px' }}
            />
            <div>
              <h1 
                className="text-xl font-bold bg-clip-text text-transparent"
                style={{ backgroundImage: 'linear-gradient(135deg, #14B8A6 0%, #06B6D4 100%)' }}
              >
                Pattern Archive
              </h1>
              <p className="text-gray-500 text-xs tracking-wider">PREVIEW MODE</p>
            </div>
          </div>
          <button
            onClick={() => window.location.href = '/#pricing'}
            className="px-5 py-2.5 rounded-lg font-semibold text-black transition-opacity hover:opacity-90"
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
            <div 
              className="rounded-2xl p-[1px]"
              style={{ background: 'linear-gradient(135deg, #14B8A6 0%, #06B6D4 100%)' }}
            >
              <div 
                className="rounded-2xl p-6 h-full"
                style={{ background: 'rgba(10, 10, 10, 0.95)', backdropFilter: 'blur(8px)' }}
              >
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
            <div 
              className="rounded-2xl p-[1px]"
              style={{ background: 'linear-gradient(135deg, #06B6D4 0%, #14B8A6 100%)' }}
            >
              <div 
                className="rounded-2xl p-6 h-full"
                style={{ background: 'rgba(10, 10, 10, 0.95)', backdropFilter: 'blur(8px)' }}
              >
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
            <div 
              className="rounded-2xl p-[1px]"
              style={{ background: 'linear-gradient(135deg, #EC4899 0%, #14B8A6 100%)' }}
            >
              <div 
                className="rounded-2xl p-6 h-full"
                style={{ background: 'rgba(10, 10, 10, 0.95)', backdropFilter: 'blur(8px)' }}
              >
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
              {userData.purchases.map((purchase) => (
                <div 
                  key={purchase.productId} 
                  className="rounded-2xl p-[1px]"
                  style={{ background: 'linear-gradient(135deg, #14B8A6 0%, #06B6D4 100%)' }}
                >
                  <div 
                    className="rounded-2xl p-6 h-full"
                    style={{ background: 'rgba(10, 10, 10, 0.95)', backdropFilter: 'blur(8px)' }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div 
                          className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-3"
                          style={{ background: 'rgba(20, 184, 166, 0.15)', border: '1px solid rgba(20, 184, 166, 0.3)' }}
                        >
                          <span className="w-2 h-2 rounded-full" style={{ background: '#14B8A6' }} />
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
                      className="w-full mt-4 px-4 py-3 rounded-xl font-semibold text-black transition-opacity hover:opacity-90 flex items-center justify-center gap-2"
                      style={{ background: 'linear-gradient(135deg, #14B8A6 0%, #06B6D4 100%)' }}
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
                  <div 
                    key={upgrade.id} 
                    className="rounded-2xl p-[1px]"
                    style={{ background: 'linear-gradient(135deg, #EC4899 0%, #F472B6 100%)' }}
                  >
                    <div 
                      className="rounded-2xl p-6 h-full"
                      style={{ background: 'rgba(10, 10, 10, 0.95)', backdropFilter: 'blur(8px)' }}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div 
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-3"
                            style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}
                          >
                            <Lock className="w-3 h-3 text-gray-500" />
                            <span className="text-xs font-bold tracking-widest text-gray-500">LOCKED</span>
                          </div>
                          <h4 className="text-xl font-bold text-white mb-2">{upgrade.name}</h4>
                          <p className="text-sm text-gray-500 mb-4">{upgrade.description}</p>
                          <div 
                            className="text-3xl font-bold bg-clip-text text-transparent"
                            style={{ backgroundImage: 'linear-gradient(135deg, #EC4899 0%, #F472B6 100%)' }}
                          >
                            ${upgrade.price}
                          </div>
                        </div>
                        <div className="p-3 rounded-xl" style={{ background: 'rgba(236, 72, 153, 0.1)' }}>
                          <Lock className="w-6 h-6" style={{ color: '#EC4899' }} />
                        </div>
                      </div>
                      <button
                        onClick={() => window.location.href = "/#pricing"}
                        className="w-full mt-4 px-4 py-3 rounded-xl font-semibold transition-opacity hover:opacity-80 flex items-center justify-center gap-2"
                        style={{ background: 'rgba(236, 72, 153, 0.1)', border: '1px solid rgba(236, 72, 153, 0.3)', color: '#EC4899' }}
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
