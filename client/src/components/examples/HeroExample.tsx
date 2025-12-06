import Hero from '../Hero';

export default function HeroExample() {
  return <Hero onCTAClick={() => console.log('CTA clicked')} />;
}
