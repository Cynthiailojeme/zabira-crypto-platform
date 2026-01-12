"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/app/utils/auth";
import { Overview } from "../components/dashboard/Overview";
import { Payments } from "../components/dashboard/Payments";
import ProfileSetup from "../components/dashboard/ProfileSetup";
import { ProfileCompletionModal } from "../components/dashboard/modals/ProfileCompletionModal";
import { SuccessModal } from "../components/dashboard/modals/SuccessModal";
import { RecentTransactionsTable } from "../components/dashboard/RecentTransactionTable";
import { transactions } from "../utils/data";
import { PromoSlides } from "../components/dashboard/PromoSlides";
import { DoMore } from "../components/dashboard/DoMore";
import { VerifyPhoneNumberModal } from "../components/dashboard/modals/VerifyPhoneNumberModal";
import { AddPersonalInfoModal } from "../components/dashboard/modals/AddPersonalInfoModal";

// ============================================
// PROGRESSION STORAGE HELPERS
// ============================================

const PROGRESSION_KEY = "dashboardProgression";

interface StepData {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

interface ProgressionData {
  completedSteps: number;
  steps: StepData[];
}

function loadProgression(): ProgressionData | null {
  if (typeof window === "undefined") return null;

  try {
    const saved = localStorage.getItem(PROGRESSION_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

function saveProgression(data: ProgressionData) {
  if (typeof window === "undefined") return;
  localStorage.setItem(PROGRESSION_KEY, JSON.stringify(data));
}

// ============================================
// MAIN DASHBOARD COMPONENT
// ============================================

export default function DashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const [completedSteps, setCompletedSteps] = useState(1);

  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [showCurrentModal, setShowCurrentModal] = useState("");
  const [successModal, setSuccessModal] = useState("");

  const handleNextStep = (val: string) => {
    setShowProfileSetup(false);
    setShowCurrentModal(val);
  };

  const [steps, setSteps] = useState([
    {
      id: 1,
      title: "Verify your email",
      description: "Takes about 2 minutes",
      action: () => {},
      completed: true,
    },
    {
      id: 2,
      title: "Verify phone number",
      description: "Takes about 2 minutes",
      action: () => handleNextStep("verify-phone-no"),
      completed: false,
    },
    {
      id: 3,
      title: "Update personal information",
      description: "Takes about 2 minutes",
      action: () => handleNextStep("add-personal-info"),
      completed: false,
    },
    {
      id: 4,
      title: "Upgrade KYC",
      description: "Takes about 2 minutes",
      action: () => {},
      completed: false,
    },
    {
      id: 5,
      title: "Enable 2FA",
      description: "Takes about 2 minutes",
      action: () => {},
      completed: false,
    },
    {
      id: 6,
      title: "Make your first transaction",
      description: "Takes about 2 minutes",
      action: () => {},
      completed: false,
    },
  ]);

  // ============================================
  // LOAD AUTH & PROGRESSION ON MOUNT
  // ============================================
  useEffect(() => {
    const user = getCurrentUser();

    if (!user) {
      router.push("/login");
      return;
    }

    if (!user.verified) {
      router.push(`/verify-email?email=${encodeURIComponent(user.email)}`);
      return;
    }

    // User is authenticated and verified
    setUserEmail(user.email);

    // Load saved progression
    const savedProgression = loadProgression();
    if (savedProgression) {
      // Restore steps with actions
      const restoredSteps = steps.map((step) => {
        const savedStep = savedProgression.steps.find((s) => s.id === step.id);
        if (savedStep) {
          return { ...step, completed: savedStep.completed };
        }
        return step;
      });

      setSteps(restoredSteps);
      setCompletedSteps(savedProgression.completedSteps);
    }

    setIsLoading(false);
  }, [router]);

  // ============================================
  // MARK STEP AS COMPLETED
  // ============================================
  const markStepCompleted = (stepId: number, stepName: string) => {
    const updatedSteps = steps.map((step) =>
      step.id === stepId ? { ...step, completed: true } : step
    );

    setSteps(updatedSteps);
    setCompletedSteps(stepId);

    // Save progression to localStorage
    const progressionData: ProgressionData = {
      completedSteps: stepId,
      steps: updatedSteps.map((s) => ({
        id: s.id,
        title: s.title,
        description: s.description,
        completed: s.completed,
      })),
    };

    saveProgression(progressionData);

    // Show success modal
    setShowCurrentModal("");
    setSuccessModal(stepName);
  };

  // ============================================
  // LOADING STATE
  // ============================================
  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary-blue border-t-transparent rounded-full animate-spin"></div>
          <p className="text-primary-text">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // ============================================
  // RENDER DASHBOARD
  // ============================================
  return (
    <main className="w-full flex flex-col gap-6">
      <Overview />

      <ProfileSetup
        completedSteps={completedSteps}
        completeSetUp={() => {
          setShowProfileSetup(true);
        }}
      />

      <Payments />

      <PromoSlides />

      <RecentTransactionsTable data={transactions} />

      <DoMore />

      {/* Modals */}
      <ProfileCompletionModal
        steps={steps}
        open={showProfileSetup}
        setOpen={setShowProfileSetup}
      />

      <VerifyPhoneNumberModal
        open={showCurrentModal === "verify-phone-no"}
        setOpen={setShowCurrentModal}
        handleCompletion={() => markStepCompleted(2, "phone-added")}
      />

      <AddPersonalInfoModal
        open={showCurrentModal === "add-personal-info"}
        setOpen={setShowCurrentModal}
        handleCompletion={() => markStepCompleted(3, "info-added")}
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
        onClose={() => setSuccessModal("")}
        handleDoneAction={() => {
          setSuccessModal("");
          const modalSequence: Record<number, string> = {
            2: "add-personal-info",
            3: "upgrade-kyc",
            4: "enable-2fa",
            5: "make-transaction",
          };
          setShowCurrentModal(
            modalSequence[completedSteps] || "verify-phone-no"
          );
        }}
      />
    </main>
  );
}
