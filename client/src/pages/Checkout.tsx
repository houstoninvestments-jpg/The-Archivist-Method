import { useEffect } from "react";
import { useLocation } from "wouter";

const STRIPE_LINKS: Record<string, string> = {
  "quickstart": "https://buy.stripe.com/cNidR1eKi8cb16qalY6c001",
  "quick-start": "https://buy.stripe.com/cNidR1eKi8cb16qalY6c001",
  "archive": "https://buy.stripe.com/8x214f7hQdwv2augKm6c002",
};

export default function Checkout() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const product = params.get("product") ?? "";
    const url = STRIPE_LINKS[product];

    if (url) {
      window.location.href = url;
    } else {
      setLocation("/");
    }
  }, [setLocation]);

  return null;
}
