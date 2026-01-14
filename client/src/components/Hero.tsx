import libraryBg from '@assets/image_1768330163168.png';
import { StaggeredText } from './animations/StaggeredText';
import { BlurIn } from './animations/BlurIn';

export default function Hero() {
  const scrollToPricing = () => {
    const pricingSection = document.getElementById('pricing');
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${libraryBg})` }}
      />
      
      {/* Dark Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/90" />
      
      {/* Accent Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-900/20 via-transparent to-pink-900/20" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Main Title - Staggered Animation */}
        <StaggeredText 
          text="THE ARCHIVIST METHOD™" 
          className="text-6xl md:text-8xl font-bold text-white text-center mb-6 justify-center"
        />

        {/* Subtitle with Gradient - Staggered Animation */}
        <StaggeredText 
          text="Pattern Archaeology, Not Therapy" 
          as="h2"
          delay={0.8}
          className="text-3xl md:text-5xl font-bold text-center mb-6 justify-center"
          wordClassName="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent"
        />

        {/* Body Text - Blur In */}
        <BlurIn delay={1.4}>
          <p className="text-xl text-gray-300 text-center max-w-3xl mx-auto mb-12">
            Stop running the same destructive patterns. Learn the proven method to interrupt trauma patterns in 7-90 days.
          </p>
        </BlurIn>

        {/* Primary CTA Button - Blur In */}
        <BlurIn delay={1.7}>
          <button
            onClick={scrollToPricing}
            data-testid="button-hero-cta"
            className="px-10 py-5 text-lg md:text-xl font-bold text-black rounded-xl transition-all transform hover:scale-105 hover:shadow-2xl hover:shadow-teal-500/30"
            style={{
              background: 'linear-gradient(135deg, #14B8A6 0%, #EC4899 100%)',
            }}
          >
            Start Free 7-Day Crash Course
          </button>
        </BlurIn>
      </div>
    </section>
  );
}
