import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Check, Clock, Zap, Shield, MessageSquare, FileText, ArrowRight, Mail, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function ThankYou() {
  const [timeLeft, setTimeLeft] = useState(600);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      setIsExpired(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleUpsellClick = () => {
    window.location.href = "https://buy.stripe.com/dR629j5dI1NS1aq3cd";
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          
          {/* Success Message Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-20 h-20 mx-auto rounded-full flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, rgba(20, 184, 166, 0.2) 0%, rgba(6, 182, 212, 0.2) 100%)",
                  border: "2px solid rgba(20, 184, 166, 0.5)",
                }}
              >
                <Mail className="w-10 h-10 text-teal-400" />
              </motion.div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4" data-testid="text-success-title">
              Check Your Email
            </h1>
            <p className="text-xl text-gray-300 mb-3" data-testid="text-success-subtitle">
              Your free 7-Day Crash Course is on its way
            </p>
            <p className="text-sm text-gray-500">
              Check your spam folder if you don't see it in 5 minutes
            </p>
          </motion.div>

          {/* Upsell Offer Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mb-16"
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/10 border border-pink-500/30 mb-4">
                <Sparkles className="w-4 h-4 text-pink-400" />
                <span className="text-pink-400 text-sm font-medium">Special Offer</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-3">
                Before You Go...
              </h2>
              <p className="text-lg text-gray-400">
                You just got the crash course. Want to fast-track the full system?
              </p>
            </div>

            {/* Glassmorphism Product Card */}
            <div
              className="relative rounded-2xl p-8 md:p-10 overflow-hidden"
              style={{
                background: "rgba(3, 3, 3, 0.97)",
                backdropFilter: "blur(32px)",
                border: "1px solid rgba(20, 184, 166, 0.3)",
                boxShadow: "0 0 60px rgba(20, 184, 166, 0.1), 0 0 120px rgba(236, 72, 153, 0.05)",
              }}
            >
              {/* Animated glow effect */}
              <div
                className="absolute inset-0 opacity-30 pointer-events-none"
                style={{
                  background: "radial-gradient(ellipse at top, rgba(20, 184, 166, 0.15) 0%, transparent 50%)",
                }}
              />

              {/* Timer Badge */}
              <div className="flex justify-center mb-6">
                <motion.div
                  animate={{ scale: isExpired ? 1 : [1, 1.02, 1] }}
                  transition={{ repeat: isExpired ? 0 : Infinity, duration: 2 }}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full ${
                    isExpired
                      ? "bg-gray-800 border-gray-600"
                      : "bg-red-500/10 border-red-500/40"
                  } border`}
                >
                  <Clock className={`w-5 h-5 ${isExpired ? "text-gray-400" : "text-red-400"}`} />
                  <span className={`font-bold text-lg ${isExpired ? "text-gray-400" : "text-red-400"}`} data-testid="text-countdown">
                    {isExpired ? "Offer Expired" : `This offer expires in ${formatTime(timeLeft)}`}
                  </span>
                </motion.div>
              </div>

              {/* Product Title */}
              <div className="text-center mb-8">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  Quick-Start System
                </h3>
                <div className="flex items-center justify-center gap-3">
                  <span className="text-4xl md:text-5xl font-bold text-teal-400">$37</span>
                  <div className="flex flex-col items-start">
                    <span className="text-gray-500 line-through text-lg">$47</span>
                    <span className="text-pink-400 text-sm font-medium">Save $10</span>
                  </div>
                </div>
              </div>

              {/* Features Grid */}
              <div className="grid md:grid-cols-2 gap-4 mb-8">
                {[
                  { icon: FileText, text: "All 7 patterns + detailed protocols" },
                  { icon: Clock, text: "90-day interruption system" },
                  { icon: MessageSquare, text: "Full Archivist AI access (unlimited chat)" },
                  { icon: Shield, text: "Circuit break library + emergency cards" },
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-start gap-3 p-3 rounded-lg bg-white/5"
                  >
                    <div className="p-2 rounded-lg bg-teal-500/10">
                      <feature.icon className="w-5 h-5 text-teal-400" />
                    </div>
                    <span className="text-gray-300 text-sm pt-1">{feature.text}</span>
                  </motion.div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="space-y-4">
                <motion.button
                  onClick={handleUpsellClick}
                  disabled={isExpired}
                  whileHover={{ scale: isExpired ? 1 : 1.02 }}
                  whileTap={{ scale: isExpired ? 1 : 0.98 }}
                  className={`w-full py-4 px-8 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${
                    isExpired
                      ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                      : "text-black hover:shadow-xl hover:shadow-teal-500/30"
                  }`}
                  style={
                    isExpired
                      ? {}
                      : {
                          background: "linear-gradient(135deg, #14B8A6 0%, #06B6D4 100%)",
                        }
                  }
                  data-testid="button-upsell-accept"
                >
                  <Zap className="w-5 h-5" />
                  {isExpired ? "Offer Has Expired" : "Yes, Add Quick-Start for $37"}
                  {!isExpired && <ArrowRight className="w-5 h-5" />}
                </motion.button>

                <div className="text-center">
                  <Link href="/">
                    <span
                      className="text-gray-500 hover:text-gray-400 text-sm cursor-pointer underline underline-offset-2 transition-colors"
                      data-testid="link-decline"
                    >
                      No thanks, I'll stick with the free course
                    </span>
                  </Link>
                </div>
              </div>

              {/* Guarantee */}
              <div className="mt-6 pt-6 border-t border-white/10 text-center">
                <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
                  <Shield className="w-4 h-4" />
                  <span>90-day money-back guarantee • Instant access • Secure checkout</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* What Happens Next Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mb-16"
          >
            <h3 className="text-2xl font-bold text-center mb-8">
              What Happens Next
            </h3>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  step: "1",
                  title: "Check Your Inbox",
                  description: "Your first lesson arrives within minutes. Each day you'll receive a new pattern to explore.",
                },
                {
                  step: "2",
                  title: "Start Recognizing",
                  description: "Begin identifying patterns in your daily life using the techniques we share.",
                },
                {
                  step: "3",
                  title: "Practice Interruption",
                  description: "Apply the basic interruption techniques to start breaking free from automatic reactions.",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="relative p-6 rounded-xl bg-white/5 border border-white/10"
                >
                  <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center font-bold text-black text-sm">
                    {item.step}
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2 mt-2">
                    {item.title}
                  </h4>
                  <p className="text-gray-400 text-sm">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 text-gray-500 text-sm">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-black"
                    style={{
                      background: `linear-gradient(135deg, hsl(${160 + i * 20}, 70%, 40%) 0%, hsl(${180 + i * 20}, 70%, 50%) 100%)`,
                    }}
                  />
                ))}
              </div>
              <span className="ml-2">Join 2,847+ pattern archaeologists</span>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
