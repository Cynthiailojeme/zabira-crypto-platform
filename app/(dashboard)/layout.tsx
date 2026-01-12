import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { Header } from "@/app/components/ui/header";
import { Sidebar } from "@/app/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const isLoggedIn = true;

  if (!isLoggedIn) {
    redirect("/signup");
  }

  return (
    <div className="flex w-full h-screen bg-white lg:bg-[#EDEDEE]">
      <Sidebar />

      <div className="relative flex flex-col flex-1 overflow-hidden">
        <Header />
        <div className="flex-1 overflow-y-auto p-6 mt-18 lg:mt-0">
          {children}
        </div>
      </div>
    </div>
  );
}
