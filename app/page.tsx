"use client";

import { useEffect, useState } from "react";
import { Overview } from "./components/dashboard/Overview";
import { Payments } from "./components/dashboard/Payments";
import ProfileSetup from "./components/dashboard/ProfileSetup";
import DashboardLayout from "./components/layout/DashboardLayout";
import { promoSlides } from "./(auth)/signup/page";
import { ProfileCompletionModal } from "./components/dashboard/modals/ProfileCompletionModal";
import { SuccessModal } from "./components/dashboard/modals/SuccessModal";
import { RecentTransactionsTable } from "./components/dashboard/RecentTransactionTable";
import { transactions } from "./utils/data";

export default function DashboardPage() {
  const [completedSteps, setCompletedSteps] = useState(4);

  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [successModal, setSucessModal] = useState("");

  const [steps, setSteps] = useState([
    {
      id: 1,
      title: "Verify your email",
      description: "Takes about 2 minutes",
      completed: true,
    },
    {
      id: 2,
      title: "Verify phone number",
      description: "Takes about 2 minutes",
      completed: false,
    },
    {
      id: 3,
      title: "Update personal information",
      description: "Takes about 2 minutes",
      completed: false,
    },
    {
      id: 4,
      title: "Upgrade KYC",
      description: "Takes about 2 minutes",
      completed: false,
    },
    {
      id: 5,
      title: "Enable 2FA",
      description: "Takes about 2 minutes",
      completed: false,
    },
    {
      id: 6,
      title: "Make your first transaction",
      description: "Takes about 2 minutes",
      completed: false,
    },
  ]);

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
    <DashboardLayout>
      <main className="w-full flex flex-col gap-6">
        {/* Overview */}
        <Overview />
        <ProfileSetup
          completedSteps={completedSteps}
          completeSetUp={() => {
            setShowProfileSetup(true);
          }}
        />

        <Payments />

        <div className="w-full flex flex-col">
          {/* Promo Slideshow */}
          <div className="relative overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${
                  currentSlide * (100 / slidesPerView)
                }%)`,
              }}
            >
              {promoSlides.map((slide, index) => (
                <div
                  key={slide.id}
                  className="shrink-0 w-full md:w-1/2 px-2"
                >
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

        <RecentTransactionsTable data={transactions} />

        <ProfileCompletionModal
          steps={steps}
          open={showProfileSetup}
          setOpen={setShowProfileSetup}
        />

        <SuccessModal
          title={
            successModal === "phone-added"
              ? "Phone Number Added!"
              : "Personal Information Added!"
          }
          description={
            successModal === "phone-added"
              ? "Your phone number has been added successfully."
              : "Your personal information has been added successfully."
          }
          open={successModal !== ""}
          onClose={() => setSucessModal("")}
          handleDoneAction={() => {}}
        />
      </main>
    </DashboardLayout>
  );
}
