import React, { useState, useEffect, useRef } from 'react';

const testimonials = [
  { name: 'MARK S.', rating: 5, text: "The level of detail in the fitting process is unlike anything I've experienced. My dispersion tightened up immediately." },
  { name: 'DAVID O., IRELAND', rating: 5, text: "Traveled all the way from Ireland just to get my clubs dialed in here. Best facility in the country, period." },
  { name: 'SARAH T.', rating: 5, text: "Started as a 15 handicap, down to an 8 in four months thanks to the TrackMan data and professional guidance." },
  { name: 'JAMES L.', rating: 5, text: "The indoor facility is top-notch. I can practice in a t-shirt while it's snowing outside. Absolute game changer." },
  { name: 'MICHAEL R.', rating: 5, text: "I finally understand why I was slicing. The video analysis showed me exactly what my hands were doing." },
  { name: 'CHRIS K.', rating: 5, text: "Best club fitting in Oklahoma. They don't push brands, they push performance that fits your swing." },
  { name: 'AMY W.', rating: 5, text: "TQG has the most welcoming atmosphere for women golfers. The staff is professional and extremely helpful." },
  { name: 'ROBERT P.', rating: 5, text: "Their custom repair shop saved my round. Fixed a snapped shaft and had it ready for my morning tee time." },
  { name: 'DANIEL M.', rating: 5, text: "The TrackMan 4 technology is insane. I've never seen my ball flight analyzed in such incredible detail." },
  { name: 'JASON H.', rating: 5, text: "Instruction here is worth every penny. My ball striking has never been more consistent." },
];
// Triple the array for infinite buffering illusion
const extended = [...testimonials, ...testimonials, ...testimonials];

export default function TestimonialSlider() {
  const [centerIndex, setCenterIndex] = useState(testimonials.length);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const slideTo = (index: number) => {
    if (isTransitioning || index === centerIndex) return;
    setIsTransitioning(true);
    setCenterIndex(index);
  };

  const next = () => slideTo(centerIndex + 1);
  const prev = () => slideTo(centerIndex - 1);

  // Jump the index back to the middle buffer block silently when approaching ends
  useEffect(() => {
    if (!isTransitioning) return;
    const timeout = setTimeout(() => {
      setIsTransitioning(false);
      if (centerIndex >= testimonials.length * 2) {
        setCenterIndex(centerIndex - testimonials.length);
      } else if (centerIndex < testimonials.length) {
        setCenterIndex(centerIndex + testimonials.length);
      }
    }, 500); 
    return () => clearTimeout(timeout);
  }, [centerIndex, isTransitioning]);

  return (
    <section className="py-24 px-6 md:px-12 bg-surface-container-lowest overflow-hidden flex flex-col items-center" id="social-proof">
      <div className="max-w-7xl w-full mx-auto relative">
        <div className="mb-16 text-center md:text-left">
          <h2 className="text-4xl md:text-6xl text-white font-headline leading-tight">REAL GOLFERS. REAL NUMBERS.</h2>
          <h3 className="text-3xl md:text-5xl font-headline mt-2" style={{color: '#a89880'}}>HERE'S WHAT HAPPENS WHEN YOU STOP GUESSING.</h3>
        </div>

        <div className="relative flex items-center group/slider">
          <button onClick={prev} className="absolute z-20 p-2 md:p-4 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm border border-white/10 transition-colors flex items-center justify-center left-2 md:-left-6">
            <span className="material-symbols-outlined text-white">chevron_left</span>
          </button>
          
          <div className="w-full overflow-hidden">
            <div 
              ref={sliderRef}
              className="flex w-full"
              style={{
                transition: isTransitioning ? 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
                transform: `translateX(calc(-${(centerIndex - (isDesktop ? 1 : 0))} * ${isDesktop ? '33.33333%' : '100%'}))`
              }}
            >
              {extended.map((t, i) => {
                const isCenter = i === centerIndex;
                const activeClass = isCenter 
                   ? "bg-primary-container text-on-primary-container shadow-2xl scale-100 md:scale-105 z-10 border-0" 
                   : "bg-surface-container text-white opacity-80 border border-white/5 scale-95";
                
                return (
                  <div key={i} className={`flex-none w-full md:w-[33.33333%] p-2 md:p-4 transition-all duration-500`}>
                    <div className={`h-full min-h-[250px] p-8 rounded-xl flex flex-col justify-between transition-all duration-500 ${activeClass}`}>
                      <div>
                        <div className="flex gap-1 mb-4">
                          {[...Array(5)].map((_, idx) => (
                            <span key={idx} className={`material-symbols-outlined ${isCenter ? 'text-on-primary-container' : 'text-primary'}`} style={{fontVariationSettings: '"FILL" 1'}}>star</span>
                          ))}
                        </div>
                        <p className={`text-lg italic mb-6 font-body transition-colors duration-500 ${isCenter ? 'text-on-primary-container' : 'text-on-surface-variant'}`}>"{t.text}"</p>
                      </div>
                      <div className="font-label font-bold uppercase tracking-widest text-sm">— {t.name}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button onClick={next} className="absolute z-20 p-2 md:p-4 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm border border-white/10 transition-colors flex items-center justify-center right-2 md:-right-6">
            <span className="material-symbols-outlined text-white">chevron_right</span>
          </button>
        </div>
        
        {/* Pagination Dots */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
          {testimonials.map((_, i) => {
            const actualIndex = centerIndex % testimonials.length;
            const isActive = i === actualIndex;
            return (
              <div 
                key={i} 
                onClick={() => slideTo(testimonials.length + i)}
                className={`pagination-dot rounded-full cursor-pointer transition-all ${isActive ? 'w-2.5 h-2.5 bg-primary-container' : 'w-2 h-2 bg-white/20 hover:bg-white/40'}`} 
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
