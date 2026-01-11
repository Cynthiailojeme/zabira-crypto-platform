"use client";

import { useState, useEffect } from "react";
import Splash from "../auth/Splash";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showSplash, setShowSplash] = useState<boolean | null>(null);

  useEffect(() => {
    // Check session storage immediately
    const splashShown = sessionStorage.getItem("splashShown");
    setShowSplash(!splashShown);
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
    sessionStorage.setItem("splashShown", "true");
  };

  return (
    <>
      {showSplash === true ? (
        <Splash onComplete={handleSplashComplete} />
      ) : (
        <div
          className={`min-h-screen transition-opacity duration-700 ${
            showSplash === false ? "opacity-100" : "opacity-0"
          }`}
          style={{
            willChange: "opacity",
            transition: "opacity 0.7s ease-in-out",
          }}
        >
          {children}
        </div>
      )}
    </>
  );
}
