import { promoSlides } from "@/app/(auth)/signup/page";
import { useEffect, useState } from "react";

export const PromoSlides = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(1);

  useEffect(() => {
    const updateSlidesPerView = () => {
      setSlidesPerView(window.innerWidth >= 768 ? 2 : 1);
    };

    updateSlidesPerView();
    window.addEventListener("resize", updateSlidesPerView);
    return () => window.removeEventListener("resize", updateSlidesPerView);
  }, []);

  // Optional: Auto-play functionality
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) =>
        prev >= Math.ceil(promoSlides.length / slidesPerView) - 1 ? 0 : prev + 1
      );
    }, 5000);
    return () => clearInterval(timer);
  }, [promoSlides.length, slidesPerView]);

  return (
    <div className="w-full flex flex-col">
      {/* Promo Slideshow */}
      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${currentSlide * (100 / slidesPerView)}%)`,
          }}
        >
          {promoSlides.map((slide, index) => (
            <div key={slide.id} className="shrink-0 w-full md:w-1/2 px-2">
              {slide.content}
            </div>
          ))}
        </div>
      </div>
      {/* Dots Navigation */}
      <div className="relative w-fit flex gap-1 mt-4 mx-auto">
        {Array.from({
          length: Math.ceil(promoSlides.length / slidesPerView),
        }).map((_, index) => (
          <button
            key={`dot-${index}`}
            onClick={() => setCurrentSlide(index)}
            className={`w-4.25 h-1 rounded-xs transition-all duration-300 ${
              index === currentSlide
                ? "bg-[#A1A1AA]"
                : "bg-[#E1E1E2] hover:bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
