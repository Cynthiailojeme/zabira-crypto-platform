"use client";

import { useState } from "react";
import { Overview } from "./components/dashboard/Overview";
import { Payments } from "./components/dashboard/Payments";
import ProfileSetup from "./components/dashboard/ProfileSetup";
import DashboardLayout from "./components/layout/DashboardLayout";
import { ProfileCompletionModal } from "./components/dashboard/modals/ProfileCompletionModal";
import { SuccessModal } from "./components/dashboard/modals/SuccessModal";
import { RecentTransactionsTable } from "./components/dashboard/RecentTransactionTable";
import { transactions } from "./utils/data";
import { PromoSlides } from "./components/dashboard/PromoSlides";
import { DoMore } from "./components/dashboard/DoMore";

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

  return (
    <DashboardLayout>
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
