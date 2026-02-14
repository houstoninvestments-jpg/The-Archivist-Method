import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Check, X, ArrowLeft, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface UserData {
  email: string;
  hasQuickStart: boolean;
  hasCompleteArchive: boolean;
}

const tiers = [
  {
    id: "crash-course",
    name: "Crash Course",
    price: "Free",
    description: "See the pattern. Name it. Start the interrupt.",
    features: [
      { name: "Your primary pattern breakdown", included: true },
      { name: "Body signature identification", included: true },
      { name: "1 circuit break script", included: true },
      { name: "7-day crash course PDF", included: true },
      { name: "The Archivist AI (limited)", included: true },
      { name: "Streak tracking", included: true },
      { name: "All 9 patterns deep dive", included: false },
      { name: "90-day interruption protocol", included: false },
      { name: "Crisis protocols", included: false },
      { name: "Pattern combination analysis", included: false },
      { name: "Relationship protocols", included: false },
      { name: "Workplace applications", included: false },
      { name: "Parenting patterns", included: false },
      { name: "Lifetime updates", included: false },
    ],
    badge: "bg-slate-700/50 text-slate-300 border-slate-600/30",
  },
  {
    id: "quick-start",
    name: "The Field Guide",
    price: "$47",
    description: "You proved it works. This makes it stick.",
    features: [
      { name: "Your primary pattern breakdown", included: true },
      { name: "Body signature identification", included: true },
      { name: "All circuit break scripts", included: true },
      { name: "7-day crash course PDF", included: true },
      { name: "The Archivist AI (full access)", included: true },
      { name: "Streak tracking", included: true },
      { name: "All 9 patterns deep dive", included: true },
      { name: "90-day interruption protocol", included: true },
      { name: "Crisis protocols", included: true },
      { name: "Pattern combination analysis", included: false },
      { name: "Relationship protocols", included: false },
      { name: "Workplace applications", included: false },
      { name: "Parenting patterns", included: false },
      { name: "Lifetime updates", included: false },
    ],
    badge: "bg-teal-500/20 text-teal-400 border-teal-500/30",
    highlight: true,
  },
  {
    id: "complete-archive",
    name: "The Complete Archive",
    price: "$197",
    description: "The full excavation. No gates. No limits.",
    features: [
      { name: "Your primary pattern breakdown", included: true },
      { name: "Body signature identification", included: true },
      { name: "All circuit break scripts", included: true },
      { name: "7-day crash course PDF", included: true },
      { name: "The Archivist AI (priority access)", included: true },
      { name: "Streak tracking", included: true },
      { name: "All 9 patterns deep dive", included: true },
      { name: "90-day interruption protocol", included: true },
      { name: "Crisis protocols", included: true },
      { name: "Pattern combination analysis", included: true },
      { name: "Relationship protocols", included: true },
      { name: "Workplace applications", included: true },
      { name: "Parenting patterns", included: true },
      { name: "Lifetime updates", included: true },
    ],
    badge: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  },
];

export default function PortalTiers() {
  const [, setLocation] = useLocation();
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/portal/user-data", { credentials: "include" });
        if (res.ok) {
          setUserData(await res.json());
        }
      } catch {
        // silently fail
      }
    };
    fetchUser();
  }, []);

  const handleCheckout = async (productId: string) => {
    try {
      const res = await fetch(`/api/portal/checkout/${productId}`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      console.error("Checkout failed");
    }
  };

  const getCurrentTier = () => {
    if (userData?.hasCompleteArchive) return "complete-archive";
    if (userData?.hasQuickStart) return "quick-start";
    return "crash-course";
  };

  const currentTier = getCurrentTier();

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <button
          onClick={() => setLocation("/portal/dashboard")}
          className="flex items-center gap-2 text-slate-500 hover:text-white text-sm mb-8 transition-colors"
          data-testid="button-back-to-portal"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Portal
        </button>

        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Choose Your Excavation Depth</h1>
          <p className="text-slate-400 max-w-lg mx-auto">
            Pattern Archaeology, <span className="text-pink-500 font-bold">NOT</span> Therapy. Every tier gives you real tools to interrupt what's running.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {tiers.map((tier) => {
            const isCurrentTier = currentTier === tier.id;
            const isLocked = (tier.id === "quick-start" && !userData?.hasQuickStart && !userData?.hasCompleteArchive) ||
                             (tier.id === "complete-archive" && !userData?.hasCompleteArchive);
            const canUpgrade = isLocked;

            return (
              <div
                key={tier.id}
                className={`rounded-2xl border p-6 flex flex-col ${
                  tier.highlight 
                    ? "border-teal-500/50 bg-[#1A1A1A]" 
                    : "border-slate-700/50 bg-[#111111]"
                } ${isCurrentTier ? "ring-2 ring-teal-500/30" : ""}`}
                data-testid={`tier-card-${tier.id}`}
              >
                <div className="mb-4">
                  <Badge className={`text-[10px] uppercase tracking-wider border ${tier.badge}`}>
                    {isCurrentTier ? "Current Tier" : tier.name}
                  </Badge>
                  <h3 className="text-xl font-bold text-white mt-3">{tier.name}</h3>
                  <p className="text-3xl font-bold text-white mt-1">{tier.price}</p>
                  <p className="text-slate-400 text-sm mt-2">{tier.description}</p>
                </div>

                <div className="flex-1 space-y-2.5 mb-6">
                  {tier.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      {feature.included ? (
                        <Check className="w-4 h-4 text-teal-400 flex-shrink-0" />
                      ) : (
                        <X className="w-4 h-4 text-slate-600 flex-shrink-0" />
                      )}
                      <span className={`text-sm ${feature.included ? "text-slate-300" : "text-slate-600"}`}>
                        {feature.name}
                      </span>
                    </div>
                  ))}
                </div>

                {isCurrentTier ? (
                  <div className="py-3 text-center rounded-xl border border-teal-500/30 text-teal-400 text-sm font-bold">
                    Your Current Plan
                  </div>
                ) : canUpgrade ? (
                  <button
                    onClick={() => handleCheckout(tier.id)}
                    className="py-3 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2"
                    data-testid={`button-upgrade-${tier.id}`}
                  >
                    Upgrade <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <div className="py-3 text-center rounded-xl border border-slate-700/50 text-slate-500 text-sm">
                    Included
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <p className="text-center text-[10px] text-slate-600 mt-8 uppercase tracking-widest font-bold">
          Pattern Archaeology, <span className="text-pink-500">NOT</span> Therapy
        </p>
      </div>
    </div>
  );
}
