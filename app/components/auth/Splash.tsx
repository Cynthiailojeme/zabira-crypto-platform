"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function Splash({ onComplete }: { onComplete?: () => void }) {
  const [fadeOut, setFadeOut] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 2000);

    const completeTimer = setTimeout(() => {
      setIsVisible(false);
      onComplete?.();
    }, 2700); // Extended to match longer transition

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-white flex items-center justify-center transition-opacity duration-700"
    >
      <div className="relative flex items-center justify-center">
        {/* Outer ripples */}
        <div className="absolute w-108 h-108 lg:w-127.5 lg:h-127.5 rounded-full border border-primary-blue animate-ripple-1"></div>
        <div className="absolute w-92.75 h-92.75 lg:w-109.5 lg:h-109.5 rounded-full border border-primary-blue/80 animate-ripple-2"></div>
        <div className="absolute w-77.5 h-77.5 lg:w-91.5 lg:h-91.5 rounded-full border border-primary-blue/60 animate-ripple-3"></div>
        <div className="absolute w-60.5 h-60.5 lg:w-71.5 lg:h-71.5 rounded-full border border-primary-blue/40 animate-ripple-4"></div>
        <div className="absolute w-43.4125 h-43.4125 lg:w-51.25 lg:h-51.25 rounded-full border border-primary-blue/20 animate-ripple-5"></div>

        {/* Logo container */}
        <div className="relative flex items-center justify-center z-10">
          <Image
            src="/images/zabira-logo.svg"
            alt="Zabira"
            width={111}
            height={111}
            className="w-[94.02px] h-[94.02px] lg:w-27.75 lg:h-27.75"
            priority
          />
        </div>
      </div>
    </div>
  );
}
