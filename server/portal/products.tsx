export interface Product {
  id: string;
  name: string;
  price: number;
  stripeProductId: string;
  stripePriceId: string;
  description: string;
  features: string[];
  pdfFileName: string;
}

export const PRODUCTS: Record<string, Product> = {
  "quick-start": {
    id: "quick-start",
    name: "Quick-Start System",
    price: 47,
    stripeProductId: "prod_quick_start",
    stripePriceId: "price_1Scurl11kGDis0LrLDIjwDc9", // Quick-Start $47
    description: "7-day intensive pattern interruption system",
    features: [
      "Complete FEIR framework introduction",
      "Quick-win strategies for immediate pattern interruption",
      "Essential worksheets and tracking tools",
      "Emergency brake techniques",
      "7-day implementation roadmap",
    ],
    pdfFileName: "quick-start-system.pdf",
  },
  "complete-archive": {
    id: "complete-archive",
    name: "Complete Archive",
    price: 197,
    stripeProductId: "prod_complete_archive",
    stripePriceId: "price_1ScuuG11kGDis0LrWdBlpZ5w", // Complete Archive $197
    description: "Full 90-day transformation system with all 7 patterns",
    features: [
      "All 7 destructive patterns fully mapped",
      "Complete 90-day rewrite protocol",
      "Advanced pattern archaeology techniques",
      "Lifetime pattern tracking system",
      "Crisis management protocols",
      "Pattern intersection analysis",
      "Custom rewrite frameworks",
      "Everything from Quick-Start System",
    ],
    pdfFileName: "complete-archive.pdf",
  },
};

export interface UserAccess {
  hasQuickStart: boolean;
  hasCompleteArchive: boolean;
  purchases: {
    productId: string;
    productName: string;
    purchasedAt: string;
  }[];
}

export function calculateUserAccess(purchases: any[]): UserAccess {
  const hasQuickStart = purchases.some((p) => p.product_id === "quick-start");
  const hasCompleteArchive = purchases.some(
    (p) => p.product_id === "complete-archive",
  );

  return {
    hasQuickStart,
    hasCompleteArchive,
    purchases: purchases.map((p) => ({
      productId: p.product_id,
      productName: p.product_name,
      purchasedAt: p.purchased_at,
    })),
  };
}

export function getAvailableUpgrades(userAccess: UserAccess): Product[] {
  const upgrades: Product[] = [];

  if (!userAccess.hasQuickStart && !userAccess.hasCompleteArchive) {
    upgrades.push(PRODUCTS["quick-start"]);
  }

  if (!userAccess.hasCompleteArchive) {
    upgrades.push(PRODUCTS["complete-archive"]);
  }

  return upgrades;
}
