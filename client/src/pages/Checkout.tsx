import { useEffect } from "react";
import { useLocation } from "wouter";

const STRIPE_MODE = (import.meta.env.VITE_STRIPE_MODE ?? "live").toLowerCase();

const LIVE_LINKS: Record<string, string> = {
  "quickstart": "https://buy.stripe.com/cNidR1eKi8cb16qalY6c001",
  "quick-start": "https://buy.stripe.com/cNidR1eKi8cb16qalY6c001",
  "archive": "https://buy.stripe.com/8x214f7hQdwv2augKm6c002",
};

const TEST_QUICK_START =
  import.meta.env.VITE_STRIPE_TEST_PAYMENT_LINK_QUICK_START ??
  LIVE_LINKS["quick-start"];
const TEST_ARCHIVE =
  import.meta.env.VITE_STRIPE_TEST_PAYMENT_LINK_COMPLETE_ARCHIVE ??
  LIVE_LINKS["archive"];

const STRIPE_LINKS: Record<string, string> =
  STRIPE_MODE === "test"
    ? {
        "quickstart": TEST_QUICK_START,
        "quick-start": TEST_QUICK_START,
        "archive": TEST_ARCHIVE,
      }
    : LIVE_LINKS;

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
