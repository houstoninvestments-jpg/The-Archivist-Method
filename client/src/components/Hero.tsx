import libraryBg from '@assets/stock_images/dark_gothic_library__440107ab.jpg';

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
        {/* Main Title */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 tracking-tight">
          THE ARCHIVIST METHOD<span className="text-teal-400">&trade;</span>
        </h1>

        {/* Subtitle with Gradient */}
        <p 
          className="text-2xl md:text-3xl lg:text-4xl font-bold mb-8"
          style={{
            background: 'linear-gradient(90deg, #14B8A6, #06B6D4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Pattern Archaeology, Not Therapy
        </p>

        {/* Body Text */}
        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-12 leading-relaxed">
          Stop running the same destructive patterns. Learn the proven method to interrupt trauma patterns in 7-90 days.
        </p>

        {/* Primary CTA Button */}
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
      </div>
    </section>
  );
}
