import { useEffect } from "react";
import { useLocation } from "wouter";

const STRIPE_PAYMENT_LINKS: Record<string, string> = {
  "quickstart": "https://buy.stripe.com/cNidR1eKi8cb16qalY6c001",
  "quick-start": "https://buy.stripe.com/cNidR1eKi8cb16qalY6c001",
  "complete-archive": "https://buy.stripe.com/8x214f7hQdwv2augKm6c002",
};

export default function Checkout() {
  const [, navigate] = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const product = params.get("product") ?? "";
    const stripeUrl = STRIPE_PAYMENT_LINKS[product];

    if (stripeUrl) {
      window.location.href = stripeUrl;
    } else {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "#000000", color: "#FAFAFA" }}
    >
      <p style={{ fontFamily: "Inter, sans-serif", fontSize: "1rem", color: "#14B8A6" }}>
        Redirecting to checkout…
      </p>
    </div>
  );
}
