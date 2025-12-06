import { useLocation } from "wouter";
import ThankYouContent from "@/components/ThankYouContent";

export default function ThankYou() {
  const [, setLocation] = useLocation();
  
  // todo: remove mock functionality - get actual purchase type from URL params or session
  const purchaseType = "pattern_session" as "pattern_session" | "complete_archive";

  const handleUpgrade = () => {
    // todo: remove mock functionality - redirect to Stripe checkout for upgrade
    console.log("Upgrading to complete archive");
  };

  return <ThankYouContent purchaseType={purchaseType} onUpgrade={handleUpgrade} />;
}
