import { useState } from 'react';
import { Download, BookOpen, MessageCircle, Clock, Lock, ArrowRight, LogOut, BookMarked, CheckCircle2, Circle, ListChecks } from 'lucide-react';
import PDFReader from '@/components/PDFReader';
import ParticleField from '@/components/ParticleField';

const archivistIcon = '/archivist-icon.png';

const previewData = {
  email: 'preview@example.com',
  name: 'Alex Thompson',
  purchases: [
    {
      productId: 'complete-archive',
      productName: 'The Complete Archive',
      description: 'All 7 Core Patterns mapped in detail with advanced pattern combinations and lifetime updates',
      price: 197,
      purchasedAt: new Date().toISOString(),
      pdfUrl: '/downloads/paid-197/THE-ARCHIVIST-METHOD-COMPLETE-ARCHIVE.pdf',
      totalPages: 504,
      currentPage: 219,
      progress: 32,
    },
    {
      productId: 'quick-start',
      productName: 'The Quick-Start System',
      description: 'Fast-track guide to identify your Original Room and start pattern interruption immediately',
      price: 47,
      purchasedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      pdfUrl: '/downloads/paid-47/THE-ARCHIVIST-METHOD-QUICK-START.pdf',
      totalPages: 82,
      currentPage: 15,
      progress: 32,
    },
  ],
  availableUpgrades: [] as { id: string; name: string; price: number; description: string }[],
};

export default function PortalDashboardPreview() {
  const userData = previewData;
  const [activePdf, setActivePdf] = useState<{
    url: string;
    title: string;
    initialPage: number;
  } | null>(null);

  const handleReadNow = (purchase: typeof previewData.purchases[0]) => {
    setActivePdf({
      url: purchase.pdfUrl,
      title: purchase.productName,
      initialPage: purchase.currentPage,
    });
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: '#030303' }}>
      <ParticleField />
      
      {/* Dark grid background pattern - fixed position */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(20, 184, 166, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(20, 184, 166, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '32px 32px',
          opacity: 0.15,
        }}
      />
      
      {/* Gothic radial texture overlay */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at 15% 25%, rgba(20, 184, 166, 0.08) 0%, transparent 45%),
            radial-gradient(ellipse at 85% 75%, rgba(236, 72, 153, 0.05) 0%, transparent 45%),
            radial-gradient(ellipse at 50% 50%, rgba(6, 182, 212, 0.03) 0%, transparent 60%)
          `,
        }}
      />
      
      {/* Deep vignette for gothic feel */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(3, 3, 3, 0.4) 50%, #030303 85%)',
        }}
      />

      {/* Ambient glow orbs */}
      <div className="fixed top-[-200px] left-[10%] w-[600px] h-[600px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(20, 184, 166, 0.08) 0%, transparent 50%)' }} />
      <div className="fixed bottom-[-150px] right-[15%] w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(236, 72, 153, 0.06) 0%, transparent 50%)' }} />

      {/* Sticky Header */}
      <header 
        className="sticky top-0 z-50"
        style={{ 
          background: 'rgba(3, 3, 3, 0.8)', 
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.04)'
        }}
      >
        <div className="max-w-6xl mx-auto px-4 py-3.5 flex items-center justify-between gap-4">
          <a href="/" className="flex items-center gap-3.5 hover:opacity-90 transition-opacity">
            <img 
              src={archivistIcon} 
              alt="The Archivist" 
              className="w-10 h-10 object-cover"
              style={{ background: '#030303', borderRadius: '50%', padding: '2px', border: '1px solid rgba(20, 184, 166, 0.25)' }}
            />
            <div>
              <h1 
                className="text-lg font-bold bg-clip-text text-transparent"
                style={{ backgroundImage: 'linear-gradient(135deg, #14B8A6 0%, #06B6D4 100%)' }}
              >
                Pattern Archive
              </h1>
              <p className="text-gray-600 text-[11px]">Member Portal</p>
            </div>
          </a>
          <div className="flex items-center gap-3">
            <span 
              className="px-1.5 py-0.5 rounded text-[9px] font-medium tracking-wider select-none"
              style={{ background: 'rgba(255, 255, 255, 0.03)', color: 'rgba(255, 255, 255, 0.35)', border: '1px solid rgba(255, 255, 255, 0.06)' }}
            >
              PREVIEW
            </span>
            <a
              href="/#products"
              className="px-4 py-2 rounded-lg font-semibold text-black text-sm transition-all duration-300 hover:scale-[1.02]"
              style={{ 
                background: 'linear-gradient(135deg, #14B8A6 0%, #06B6D4 100%)', 
                boxShadow: '0 4px 20px rgba(20, 184, 166, 0.25), inset 0 1px 0 rgba(255,255,255,0.2)' 
              }}
              data-testid="button-get-access"
            >
              Get Full Access
            </a>
            <a
              href="/portal/login"
              className="p-2 rounded-lg transition-all duration-300 hover:scale-[1.02]"
              style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)' }}
              data-testid="button-logout"
              title="Logout"
            >
              <LogOut className="w-4 h-4 text-gray-500" />
            </a>
          </div>
        </div>
      </header>

      <div className="relative px-4 pb-20 pt-8">
        <div className="max-w-6xl mx-auto">

          {/* Welcome Message */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-1.5">
              Welcome back, <span style={{ color: '#14B8A6' }}>{userData.name ? userData.name.split(' ')[0] : 'Archivist'}</span>
            </h2>
            <p className="text-gray-500 text-sm">{userData.email}</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {/* Days in Archive */}
            <div 
              className="rounded-xl p-[1px] transition-all duration-300 hover:translate-y-[-2px]"
              style={{ background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.4) 0%, rgba(6, 182, 212, 0.2) 100%)' }}
            >
              <div 
                className="rounded-xl p-5 h-full transition-shadow duration-300"
                style={{ 
                  background: 'rgba(10, 10, 10, 0.6)', 
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div 
                    className="p-2.5 rounded-lg transition-all duration-300"
                    style={{ 
                      background: 'rgba(20, 184, 166, 0.1)',
                      boxShadow: '0 0 20px rgba(20, 184, 166, 0.15)'
                    }}
                  >
                    <Clock className="w-5 h-5" style={{ color: '#14B8A6' }} />
                  </div>
                  <span className="text-3xl font-bold text-white">14</span>
                </div>
                <p className="text-gray-400 text-sm font-medium">Days in Archive</p>
              </div>
            </div>

            {/* Active Systems */}
            <div 
              className="rounded-xl p-[1px] transition-all duration-300 hover:translate-y-[-2px]"
              style={{ background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.4) 0%, rgba(20, 184, 166, 0.2) 100%)' }}
            >
              <div 
                className="rounded-xl p-5 h-full transition-shadow duration-300"
                style={{ 
                  background: 'rgba(10, 10, 10, 0.6)', 
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div 
                    className="p-2.5 rounded-lg transition-all duration-300"
                    style={{ 
                      background: 'rgba(6, 182, 212, 0.1)',
                      boxShadow: '0 0 20px rgba(6, 182, 212, 0.15)'
                    }}
                  >
                    <BookOpen className="w-5 h-5" style={{ color: '#06B6D4' }} />
                  </div>
                  <span className="text-3xl font-bold text-white">2</span>
                </div>
                <p className="text-gray-400 text-sm font-medium">Active Systems</p>
              </div>
            </div>

            {/* AI Conversations */}
            <div 
              className="rounded-xl p-[1px] transition-all duration-300 hover:translate-y-[-2px]"
              style={{ background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.35) 0%, rgba(20, 184, 166, 0.2) 100%)' }}
            >
              <div 
                className="rounded-xl p-5 h-full transition-shadow duration-300"
                style={{ 
                  background: 'rgba(10, 10, 10, 0.6)', 
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div 
                    className="p-2.5 rounded-lg transition-all duration-300"
                    style={{ 
                      background: 'rgba(236, 72, 153, 0.1)',
                      boxShadow: '0 0 20px rgba(236, 72, 153, 0.15)'
                    }}
                  >
                    <MessageCircle className="w-5 h-5" style={{ color: '#EC4899' }} />
                  </div>
                  <span className="text-3xl font-bold text-white">∞</span>
                </div>
                <p className="text-gray-400 text-sm font-medium">AI Conversations</p>
              </div>
            </div>
          </div>

          {/* Talk to The Archivist AI - Premium CTA Section */}
          <section className="mb-10">
            <div 
              className="rounded-2xl p-[2px] transition-all duration-300 hover:translate-y-[-2px]"
              style={{ 
                background: 'linear-gradient(135deg, #14B8A6 0%, #EC4899 100%)',
                boxShadow: '0 0 40px rgba(20, 184, 166, 0.15), 0 0 60px rgba(236, 72, 153, 0.1)'
              }}
            >
              <div 
                className="rounded-2xl p-6 md:p-8"
                style={{ 
                  background: 'rgba(10, 10, 10, 0.6)', 
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.03)'
                }}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <div className="flex items-center gap-5">
                    <div 
                      className="p-4 rounded-xl flex-shrink-0"
                      style={{ 
                        background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.15) 0%, rgba(236, 72, 153, 0.1) 100%)',
                        boxShadow: '0 0 30px rgba(20, 184, 166, 0.2)'
                      }}
                    >
                      <MessageCircle className="w-8 h-8" style={{ color: '#14B8A6' }} />
                    </div>
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold text-white mb-1.5">Excavating Your Patterns?</h3>
                      <p className="text-gray-400 text-sm md:text-base">The Archivist AI can help identify which of the 7 Core Patterns are active in your life right now.</p>
                    </div>
                  </div>
                  <a
                    href="/"
                    className="flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl font-semibold text-black transition-all duration-300 hover:scale-[1.02] flex-shrink-0"
                    style={{ 
                      background: 'linear-gradient(135deg, #14B8A6 0%, #06B6D4 100%)',
                      boxShadow: '0 4px 24px rgba(20, 184, 166, 0.35), inset 0 1px 0 rgba(255,255,255,0.2)'
                    }}
                    data-testid="button-start-conversation"
                  >
                    <span>Begin Pattern Analysis</span>
                    <ArrowRight className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Getting Started Checklist */}
          <section className="mb-10">
            <h3 className="text-xl font-bold text-white mb-5 flex items-center gap-3">
              <span className="w-1 h-6 rounded-full" style={{ background: 'linear-gradient(180deg, #14B8A6 0%, #06B6D4 100%)' }} />
              Getting Started
            </h3>

            <div 
              className="rounded-xl p-[1px] transition-all duration-300"
              style={{ 
                background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.5) 0%, rgba(6, 182, 212, 0.3) 100%)',
                boxShadow: '0 0 30px rgba(20, 184, 166, 0.1)'
              }}
            >
              <div 
                className="rounded-xl p-6"
                style={{ 
                  background: 'rgba(10, 10, 10, 0.6)', 
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
                }}
              >
                <div className="flex items-center gap-3 mb-5">
                  <div 
                    className="p-2 rounded-lg"
                    style={{ background: 'rgba(20, 184, 166, 0.1)' }}
                  >
                    <ListChecks className="w-5 h-5" style={{ color: '#14B8A6' }} />
                  </div>
                  <div>
                    <span className="text-white font-semibold">Your First Steps</span>
                    <span className="text-gray-500 text-sm ml-2">1 of 3 complete</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Completed Item */}
                  <div className="flex items-center gap-3 p-3 rounded-lg" style={{ background: 'rgba(20, 184, 166, 0.05)' }}>
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: '#14B8A6' }} />
                    <span className="text-gray-300 line-through opacity-70">Download your PDF materials</span>
                  </div>

                  {/* Uncompleted Items */}
                  <div className="flex items-center gap-3 p-3 rounded-lg" style={{ background: 'rgba(255, 255, 255, 0.02)' }}>
                    <Circle className="w-5 h-5 flex-shrink-0 text-gray-600" />
                    <span className="text-gray-300">Read the introduction to identify your Original Room</span>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg" style={{ background: 'rgba(255, 255, 255, 0.02)' }}>
                    <Circle className="w-5 h-5 flex-shrink-0 text-gray-600" />
                    <span className="text-gray-300">Complete your first pattern interrupt exercise</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-5 pt-4 border-t" style={{ borderColor: 'rgba(255, 255, 255, 0.06)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500">Progress</span>
                    <span className="text-xs font-semibold" style={{ color: '#14B8A6' }}>33% complete</span>
                  </div>
                  <div 
                    className="h-2 rounded-full overflow-hidden"
                    style={{ background: 'rgba(255, 255, 255, 0.05)' }}
                  >
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{ 
                        width: '33%',
                        background: 'linear-gradient(90deg, #14B8A6 0%, #06B6D4 100%)',
                        boxShadow: '0 0 12px rgba(20, 184, 166, 0.6)'
                      }}
                    />
                  </div>
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
                  className="rounded-xl p-[1px] transition-all duration-300 hover:translate-y-[-2px]"
                  style={{ 
                    background: 'linear-gradient(135deg, #14B8A6 0%, #06B6D4 100%)',
                    boxShadow: '0 0 30px rgba(20, 184, 166, 0.1)'
                  }}
                >
                  <div 
                    className="rounded-xl p-6 h-full"
                    style={{ 
                      background: 'rgba(10, 10, 10, 0.6)', 
                      backdropFilter: 'blur(10px)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
                    }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div 
                          className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full mb-3"
                          style={{ background: 'rgba(20, 184, 166, 0.1)', border: '1px solid rgba(20, 184, 166, 0.2)' }}
                        >
                          <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#14B8A6', boxShadow: '0 0 8px #14B8A6' }} />
                          <span className="text-[10px] font-bold tracking-widest" style={{ color: '#14B8A6' }}>ACTIVE</span>
                        </div>
                        <h4 className="text-lg font-bold text-white mb-2">{purchase.productName}</h4>
                        <p className="text-gray-400 text-sm mb-3">{purchase.description}</p>
                        <p className="text-xs text-gray-500">
                          <span className="font-semibold text-gray-400">${purchase.price}</span> · Accessed {new Date(purchase.purchasedAt).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </p>
                      </div>
                      <div 
                        className="p-2.5 rounded-lg flex-shrink-0 ml-4"
                        style={{ 
                          background: 'rgba(20, 184, 166, 0.08)',
                          boxShadow: '0 0 20px rgba(20, 184, 166, 0.1)'
                        }}
                      >
                        <BookOpen className="w-5 h-5" style={{ color: '#14B8A6' }} />
                      </div>
                    </div>

                    {/* Progress Section */}
                    <div className="mb-4 pt-3 border-t" style={{ borderColor: 'rgba(255, 255, 255, 0.06)' }}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <BookMarked className="w-3.5 h-3.5 text-gray-500" />
                          <span className="text-xs text-gray-500">Last read: Page {purchase.currentPage}</span>
                        </div>
                        <span className="text-xs font-semibold" style={{ color: '#14B8A6' }}>{purchase.progress}% complete</span>
                      </div>
                      {/* Progress Bar */}
                      <div 
                        className="h-1.5 rounded-full overflow-hidden"
                        style={{ background: 'rgba(255, 255, 255, 0.05)' }}
                      >
                        <div 
                          className="h-full rounded-full transition-all duration-500"
                          style={{ 
                            width: `${purchase.progress}%`,
                            background: 'linear-gradient(90deg, #14B8A6 0%, #06B6D4 100%)',
                            boxShadow: '0 0 10px rgba(20, 184, 166, 0.5)'
                          }}
                        />
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={() => handleReadNow(purchase)}
                        className="flex-1 px-4 py-3 rounded-lg font-semibold text-black transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2 text-sm"
                        style={{ 
                          background: 'linear-gradient(135deg, #14B8A6 0%, #06B6D4 100%)',
                          boxShadow: '0 4px 20px rgba(20, 184, 166, 0.25), inset 0 1px 0 rgba(255,255,255,0.15)'
                        }}
                        data-testid={`button-read-${purchase.productId}`}
                      >
                        <BookOpen className="w-4 h-4" />
                        <span>Read Now</span>
                      </button>
                      <a
                        href={purchase.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        className="px-4 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2 text-sm"
                        style={{ 
                          background: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          color: '#fff'
                        }}
                        data-testid={`button-download-${purchase.productId}`}
                      >
                        <Download className="w-4 h-4" />
                        <span className="hidden sm:inline">Download</span>
                      </a>
                    </div>
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
                    className="rounded-xl p-[1px] transition-all duration-300 hover:translate-y-[-2px]"
                    style={{ background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.4) 0%, rgba(244, 114, 182, 0.2) 100%)' }}
                  >
                    <div 
                      className="rounded-xl p-6 h-full"
                      style={{ 
                        background: 'rgba(10, 10, 10, 0.6)', 
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
                      }}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div 
                            className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full mb-3"
                            style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)' }}
                          >
                            <Lock className="w-3 h-3 text-gray-500" />
                            <span className="text-[10px] font-bold tracking-widest text-gray-500">LOCKED</span>
                          </div>
                          <h4 className="text-lg font-bold text-white mb-2">{upgrade.name}</h4>
                          <p className="text-sm text-gray-400 mb-4">{upgrade.description}</p>
                          <div 
                            className="text-2xl font-bold bg-clip-text text-transparent"
                            style={{ backgroundImage: 'linear-gradient(135deg, #EC4899 0%, #F472B6 100%)' }}
                          >
                            ${upgrade.price}
                          </div>
                        </div>
                        <div 
                          className="p-2.5 rounded-lg flex-shrink-0 ml-4"
                          style={{ background: 'rgba(236, 72, 153, 0.06)' }}
                        >
                          <Lock className="w-5 h-5" style={{ color: '#EC4899' }} />
                        </div>
                      </div>
                      <a
                        href="/#products"
                        className="w-full mt-3 px-4 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2 text-sm"
                        style={{ 
                          background: 'rgba(236, 72, 153, 0.08)', 
                          border: '1px solid rgba(236, 72, 153, 0.2)', 
                          color: '#EC4899' 
                        }}
                        data-testid={`button-unlock-${upgrade.id}`}
                      >
                        <span>Unlock System</span>
                        <ArrowRight className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* PDF Reader Modal */}
      {activePdf && (
        <PDFReader
          pdfUrl={activePdf.url}
          title={activePdf.title}
          initialPage={activePdf.initialPage}
          onClose={() => setActivePdf(null)}
        />
      )}
    </div>
  );
}
