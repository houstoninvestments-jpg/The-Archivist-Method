import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Download, BookOpen, MessageCircle, TrendingUp, Lock, ArrowRight } from 'lucide-react';

interface UserData {
  email: string;
  purchases: Array<{
    productId: string;
    productName: string;
    purchasedAt: string;
  }>;
  availableUpgrades: Array<{
    id: string;
    name: string;
    price: number;
    description: string;
  }>;
}

export default function PortalDashboard() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [, setLocation] = useLocation();

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const response = await fetch('/api/portal/user-data');

      if (!response.ok) {
        if (response.status === 401) {
          setLocation('/portal/login');
          return;
        }
        throw new Error('Failed to load user data');
      }

      const data = await response.json();
      setUserData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    setLocation('/portal/login');
  };

  const handleDownload = (productId: string) => {
    window.open(`/api/portal/download/${productId}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-500/20 border-t-teal-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Accessing your archive...</p>
        </div>
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="max-w-md p-8 bg-red-500/5 border border-red-500/30 rounded-2xl text-center">
          <p className="text-red-400 mb-6">{error || 'Unable to access archive'}</p>
          <button
            onClick={() => setLocation('/portal/login')}
            className="px-6 py-3 bg-teal-500 hover:bg-teal-600 rounded-lg text-black font-semibold transition-colors"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  const daysSinceStart = userData.purchases.length > 0 
    ? Math.floor((Date.now() - new Date(userData.purchases[0].purchasedAt).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

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
                <img src="/archivist-icon.png" alt="The Archivist" className="w-12 h-12" />
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                    Pattern Archive
                  </h1>
                  <p className="text-xs text-gray-500">The Archivist Method</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm text-gray-400 hover:text-white border border-white/10 hover:border-white/20 rounded-lg transition-all"
              >
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
                  <TrendingUp className="w-8 h-8 text-teal-400" />
                  <span className="text-3xl font-bold text-white">{daysSinceStart}</span>
                </div>
                <p className="text-gray-400 font-medium">Days in Archive</p>
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

            {userData.purchases.length === 0 ? (
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-12 text-center">
                <p className="text-gray-400 text-lg mb-6">No systems unlocked yet. Begin your excavation.</p>
                <button
                  onClick={() => window.location.href = "/#products"}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 rounded-lg text-black font-semibold transition-all"
                >
                  <span>View Systems</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            ) : (
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
            )}
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
                        onClick={() => window.location.href = "/#products"}
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