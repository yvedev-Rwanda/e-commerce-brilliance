import { useState, useEffect } from 'react';
import heroBuying from '@/assets/hero-buying.jpg';
import heroExchange from '@/assets/hero-exchange.jpg';
import heroSelling from '@/assets/hero-selling.jpg';
import heroUnboxing from '@/assets/hero-unboxing.jpg';

const photos = [
  { src: heroBuying, label: '🛒 Buying', sublabel: 'Find your perfect device' },
  { src: heroExchange, label: '🔄 Exchange', sublabel: 'Trade & upgrade easily' },
  { src: heroSelling, label: '💻 Selling', sublabel: 'List & sell fast' },
  { src: heroUnboxing, label: '📦 Unboxing', sublabel: 'Joy of new tech' },
];

const HeroPhotoCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setActiveIndex((prev) => (prev + 1) % photos.length);
        setIsAnimating(false);
      }, 400);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full max-w-sm mx-auto">
      {/* Main featured photo */}
      <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-accent/20 aspect-[4/3]">
        <img
          src={photos[activeIndex].src}
          alt={photos[activeIndex].label}
          width={800}
          height={800}
          className={`w-full h-full object-cover transition-all duration-700 ${
            isAnimating ? 'scale-110 opacity-0' : 'scale-100 opacity-100'
          }`}
        />
        {/* Overlay label */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4">
          <p className={`text-white font-bold text-lg transition-all duration-500 ${
            isAnimating ? 'translate-y-4 opacity-0' : 'translate-y-0 opacity-100'
          }`}>
            {photos[activeIndex].label}
          </p>
          <p className={`text-white/70 text-sm transition-all duration-500 delay-100 ${
            isAnimating ? 'translate-y-4 opacity-0' : 'translate-y-0 opacity-100'
          }`}>
            {photos[activeIndex].sublabel}
          </p>
        </div>
        {/* Animated border glow */}
        <div className="absolute inset-0 rounded-2xl border-2 border-accent/30 animate-pulse pointer-events-none" style={{ animationDuration: '2s' }} />
      </div>

      {/* Thumbnail strip */}
      <div className="flex gap-2 mt-3 justify-center">
        {photos.map((photo, i) => (
          <button
            key={i}
            onClick={() => { setIsAnimating(true); setTimeout(() => { setActiveIndex(i); setIsAnimating(false); }, 400); }}
            className={`relative w-14 h-14 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
              i === activeIndex
                ? 'border-accent scale-110 shadow-lg shadow-accent/30'
                : 'border-border/50 opacity-60 hover:opacity-100'
            }`}
          >
            <img src={photo.src} alt={photo.label} className="w-full h-full object-cover" loading="lazy" />
          </button>
        ))}
      </div>

      {/* Floating activity badges */}
      <div className={`absolute -top-3 -right-3 bg-accent text-accent-foreground text-xs font-bold px-3 py-1.5 rounded-full shadow-lg animate-float transition-all duration-500 ${
        activeIndex === 0 ? 'opacity-100' : activeIndex === 2 ? 'opacity-100' : 'opacity-0'
      }`}>
        {activeIndex === 0 ? '✨ Best Deals' : '🔥 Hot Sales'}
      </div>

      <div className={`absolute -bottom-2 -left-3 bg-card text-foreground text-xs font-medium px-3 py-1.5 rounded-full shadow-lg border border-border animate-float transition-all duration-500 ${
        activeIndex === 1 || activeIndex === 3 ? 'opacity-100' : 'opacity-0'
      }`} style={{ animationDelay: '1s' }}>
        {activeIndex === 1 ? '🤝 Easy Trade-In' : '🎉 Just Delivered!'}
      </div>
    </div>
  );
};

export default HeroPhotoCarousel;
