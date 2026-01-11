import ProductCard from '../ProductCard';

export default function ProductCardExample() {
  return (
    <div className="grid gap-6 md:grid-cols-3 max-w-6xl mx-auto">
      <ProductCard
        title="7-Day Crash Course"
        subtitle="Can't commit to 90 days? Start here."
        price="FREE"
        tier="free"
        badge="FREE"
        ctaText="Start Free"
        features={[
          "Pattern identification basics",
          "Body signature recognition",
          "First interrupt attempt",
          "Core concepts introduction",
        ]}
        onBuyClick={() => console.log('Free tier clicked')}
      />
      <ProductCard
        title="Quick-Start System"
        subtitle="Fix ONE pattern in 90 days"
        price={47}
        tier="popular"
        badge="MOST POPULAR"
        ctaText="Get Quick-Start - $47"
        features={[
          "Complete 90-day protocol",
          "Crisis protocols",
          "Tracking templates",
          "Relationship scripts",
          "Pattern interrupt techniques",
        ]}
        onBuyClick={() => console.log('$47 tier clicked')}
      />
      <ProductCard
        title="Complete Archive"
        subtitle="Master all patterns. Every context. Forever."
        price={197}
        tier="premium"
        badge="LIFETIME ACCESS"
        ctaText="Get Full Archive - $197"
        features={[
          "All 7 Core Patterns mapped",
          "All 23 sections covered",
          "Advanced applications",
          "Lifetime reference",
          "All bonuses included",
          "Daily tracker templates",
        ]}
        onBuyClick={() => console.log('$197 tier clicked')}
      />
    </div>
  );
}
