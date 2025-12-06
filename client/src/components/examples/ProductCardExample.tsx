import ProductCard from '../ProductCard';

export default function ProductCardExample() {
  return (
    <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
      <ProductCard
        title="Pattern Recognition Session"
        price={47}
        features={[
          "90-minute Pattern Recognition video",
          "Pattern Recognition Workbook (PDF)",
          "30 days AI chatbot access",
          "Identify 2-3 dominant patterns",
          "Learn 4-step excavation method",
        ]}
        onBuyClick={() => console.log('Buy $47 clicked')}
      />
      <ProductCard
        title="The Complete Pattern Archive"
        price={97}
        features={[
          "Everything from $47 product",
          "250+ page pattern manual",
          "All 7 core patterns deep dive",
          "90-day week-by-week protocol",
          "Pattern combination strategies",
          "Lifetime AI chatbot access",
        ]}
        isPremium
        badge="COMPLETE SYSTEM"
        onBuyClick={() => console.log('Buy $97 clicked')}
      />
    </div>
  );
}
