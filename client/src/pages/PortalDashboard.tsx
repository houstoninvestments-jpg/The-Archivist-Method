import { useEffect, useState } from "react";
import { useLocation } from "wouter";

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
  const [error, setError] = useState("");
  const [, setLocation] = useLocation();

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const response = await fetch("/api/portal/user-data");
      if (!response.ok) {
        if (response.status === 401) {
          setLocation("/portal/login");
          return;
        }
        throw new Error("Failed to load user data");
      }
      const data = await response.json();
      setUserData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    document.cookie =
      "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    setLocation("/portal/login");
  };

  const handleDownload = (productId: string) => {
    window.open(`/api/portal/download/${productId}`, "_blank");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-5">
        <div className="max-w-md p-10 bg-red-500/10 border border-red-500/30 rounded-2xl text-center">
          <p className="text-red-500 mb-5">
            {error || "Unable to load content"}
          </p>
          <button
            onClick={() => setLocation("/portal/login")}
            className="px-6 py-3 bg-cyan-500 rounded-lg text-black font-semibold"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-5">
      <div className="max-w-7xl mx-auto mb-10 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">
            The Archivist Method
          </h1>
          <p className="text-sm text-white/60">{userData.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="px-5 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/15"
        >
          Logout
        </button>
      </div>

      <div className="max-w-7xl mx-auto">
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-6">
            Your Content
          </h2>
          {userData.purchases.length === 0 ? (
            <div className="p-10 bg-white/5 border border-white/10 rounded-xl text-center">
              <p className="text-white/70 mb-5">
                No content yet. Purchase a product to get started.
              </p>
              <a
                href="/#products"
                className="inline-block px-6 py-3 bg-cyan-500 rounded-lg text-black font-semibold no-underline"
              >
                View Products
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {userData.purchases.map((purchase) => (
                <div
                  key={purchase.productId}
                  className="p-6 bg-white/5 border border-cyan-500/30 rounded-xl"
                >
                  <div className="inline-block px-3 py-1 bg-cyan-500/20 rounded-full text-xs text-cyan-500 font-semibold mb-4">
                    UNLOCKED
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {purchase.productName}
                  </h3>
                  <p className="text-xs text-white/50 mb-5">
                    Purchased{" "}
                    {new Date(purchase.purchasedAt).toLocaleDateString()}
                  </p>
                  <button
                    onClick={() => handleDownload(purchase.productId)}
                    className="w-full py-3 bg-cyan-500 rounded-lg text-black font-semibold hover:bg-cyan-600"
                  >
                    Download PDF
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {userData.availableUpgrades.length > 0 && (
          <section>
            <h2 className="text-2xl font-semibold text-white mb-6">
              Upgrade Your Access
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {userData.availableUpgrades.map((upgrade) => (
                <div
                  key={upgrade.id}
                  className="p-6 bg-white/5 border border-white/10 rounded-xl"
                >
                  <div className="inline-block px-3 py-1 bg-white/10 rounded-full text-xs text-white/60 font-semibold mb-4">
                    LOCKED
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {upgrade.name}
                  </h3>
                  <p className="text-sm text-white/70 mb-4">
                    {upgrade.description}
                  </p>
                  <div className="text-3xl font-bold text-cyan-500 mb-4">
                    ${upgrade.price}
                  </div>
                  <a
                    href="/#products"
                    className="block w-full py-3 bg-cyan-500/20 border border-cyan-500/40 rounded-lg text-cyan-500 font-semibold text-center no-underline hover:bg-cyan-500/30"
                  >
                    Upgrade Now
                  </a>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
