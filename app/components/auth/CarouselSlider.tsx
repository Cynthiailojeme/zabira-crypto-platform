"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export const signUpCarouselItems = [
  {
    title: "Easily Buy & Sell Cryptocurrencies, Giftcards & Pay Bills",
    description: "Manage your assets and portfolio easily!",
    bgImage: "/images/graphic-element.svg",
    image: "",
  },
  {
    title: "Trade Cryptocurrencies",
    description: "Easy way to buy, sell, convert and store cryptocurrencies",
    bgImage: "/images/hero-image.svg",
    image: "/images/trade-crypto.svg",
  },
  {
    title: "Pay Bills",
    description:
      "Instantly pay all your bills and make payments all over the world",
    bgImage: "/images/hero-image.svg",
    image: "/images/pay-bills.svg",
  },
  {
    title: "Trade Giftcards",
    description: "Trade giftcards with Bitcoin, Ether, Tether, and more.",
    bgImage: "/images/hero-image.svg",
    image: "/images/trade-giftcards.svg",
  },
];

export const VerifyEmailCarouselItems = [
  {
    title: "Trade Giftcards",
    description: "Trade giftcards with Bitcoin, Ether, Tether, and more.",
    bgImage: "/images/hero-image.svg",
    image: "/images/trade-giftcards.svg",
  },
  {
    title: "Customer Support",
    description:
      "We provide excellent customer support to ensure seamless experience",
    bgImage: "/images/hero-image.svg",
    image: "/images/customer-support.svg",
  },
  {
    title: "Trade Cryptocurrencies",
    description: "Easy way to buy, sell, convert and store cryptocurrencies",
    bgImage: "/images/hero-image.svg",
    image: "/images/trade-crypto.svg",
  },
  {
    title: "Pay Bills",
    description:
      "Instantly pay all your bills and make payments all over the world",
    bgImage: "/images/hero-image.svg",
    image: "/images/pay-bills.svg",
  },
];

interface CarouselItem {
  bgImage: string | Blob;
  image: string | Blob;
  title: string;
  description: string;
}

export function CarouselSidebar() {
    const pathname = usePathname();

  const carouselItems =
    pathname === "/verify-email"
      ? VerifyEmailCarouselItems
      : signUpCarouselItems;

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <aside className="hidden w-100 bg-linear-to-b from-[#003B8D] via-[#001a3d] to-black rounded-2xl sticky top-0 h-[95vh] lg:flex flex-col p-9 overflow-hidden">
      {/* Background Pattern Carousel */}
      <div className="absolute inset-0">
        {carouselItems.map((item: CarouselItem, index: number) => (
          <div
            key={`bg-${index}`}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={item.bgImage}
              alt=""
              className="w-full h-full object-cover opacity-60"
            />
          </div>
        ))}
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex flex-col justify-between flex-1 gap-9">
        {/* Logo */}
        <Image
          src="/images/z-logo.svg"
          alt="Zabira"
          width={115}
          height={24}
          priority
        />

        {/* Illustration Carousel - Center Area */}
        <div
          className={`${
            currentSlide === 0 ? "bg-transparent" : "bg-[#00102680]/50"
          } relative flex-1 flex items-center justify-center min-h-120 w-[20rem] p-6 rounded-xl`}
        >
          {carouselItems.map(
            (
              item: CarouselItem,
              index: number
            ) => (
              <div
                key={`img-${index}`}
                className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-in-out ${
                  index === currentSlide ? "opacity-100" : "opacity-0"
                }`}
              >
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="max-w-50 max-h-50 object-contain"
                  />
                )}
              </div>
            )
          )}
        </div>

        {/* Text Content Carousel */}
        <div className="relative z-10 flex-1 flex flex-col justify-end">
          <div className="relative flex-1 flex flex-col justify-end">
            {carouselItems.map((item: CarouselItem, index: number) => (
              <div
                key={`text-${index}`}
                className={`absolute inset-0 flex flex-col justify-end transition-all duration-700 ease-in-out ${
                  index === currentSlide
                    ? "opacity-100 translate-x-0"
                    : index < currentSlide
                    ? "opacity-0 -translate-x-8"
                    : "opacity-0 translate-x-8"
                }`}
              >
                <h2 className="text-white text-[2rem] font-extrabold mb-2 leading-[2.48rem] tracking-[-0.024rem]">
                  {item.title}
                </h2>
                <p className="text-white/70 text-xl font-medium leading-7 tracking-[-0.0125rem]">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          {/* Dots Navigation */}
          <div className="relative flex gap-1 mt-6">
            {carouselItems.map((_: CarouselItem, index: number) => (
              <button
                key={`dot-${index}`}
                onClick={() => setCurrentSlide(index)}
                className={`w-4.25 h-1 rounded-xs transition-all duration-300 ${
                  index === currentSlide
                    ? "bg-white"
                    : "bg-white/30 hover:bg-white/50"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
