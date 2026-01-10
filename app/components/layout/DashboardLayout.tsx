import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { Header } from "../ui/header";
import { Sidebar } from "../ui/sidebar";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const isLoggedIn = true; // Replace with actual authentication logic

  if (!isLoggedIn) {
    localStorage.clear();
    return <Navigate to="/signup" replace />;
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
};

export default DashboardLayout;
