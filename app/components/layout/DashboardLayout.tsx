"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "../ui/sidebar";
import { Header } from "../ui/header";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  requireVerified?: boolean;
}

/**
 * Protected Route Component
 *
 * Wraps components/pages that require authentication.
 * Automatically redirects unauthenticated users to signup.
 *
 */
export function ProtectedRoute({
  children,
  redirectTo = "/signup",
  requireVerified = true,
}: ProtectedRouteProps) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const currentUser = localStorage.getItem("currentUser");

        if (!currentUser) {
          // No user logged in
          router.push(redirectTo);
          return;
        }

        const userData = JSON.parse(currentUser);

        if (requireVerified && !userData.verified) {
          // User not verified
          router.push(
            `/verify-email?email=${encodeURIComponent(userData.email)}`
          );
          return;
        }

        // User is authorized
        setIsAuthorized(true);
      } catch (error) {
        console.error("Auth check error:", error);
        localStorage.removeItem("currentUser");
        router.push(redirectTo);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router, redirectTo, requireVerified]);

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary-blue border-t-transparent rounded-full animate-spin"></div>
          <p className="text-primary-text">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
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
