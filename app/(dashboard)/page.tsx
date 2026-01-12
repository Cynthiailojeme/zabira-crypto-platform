"use client";

import { useState } from "react";
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

export default function DashboardPage() {
  const [completedSteps, setCompletedSteps] = useState(1);

  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [showCurrentModal, setShowCurrentModal] = useState("");
  const [successModal, setSucessModal] = useState("");

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

  const markStepCompleted = (stepId: number, stepName: string) => {
    setSteps((prevSteps) =>
      prevSteps.map((step) =>
        step.id === stepId ? { ...step, completed: true } : step
      )
    );
    setCompletedSteps(stepId);
    setShowCurrentModal("");
    setSucessModal(stepName);
  };

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

      {/* Modals */}
      <VerifyPhoneNumberModal
        open={showCurrentModal === "verify-phone-no"}
        setOpen={setShowCurrentModal}
        handleCompletion={() => markStepCompleted(2, "phone-added")}
      />

      {/* Modals */}
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
        onClose={() => setSucessModal("")}
        handleDoneAction={() => {
          setSucessModal("");
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
