"use client";

import { useState, useEffect } from "react";
import { LogOut, User as UserIcon } from "lucide-react";
import { logout, getCurrentUser } from "@/app/utils/auth";
import { LogoutPopup } from "./LogoutPopup";

export function UserMenu() {
  const [userEmail, setUserEmail] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setUserEmail(user.email);
    }
  }, []);

  const handleConfirmLogout = () => {
    logout();
    setShowLogoutModal(false);
    setShowMenu(false);
  };

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-primary-blue text-white flex items-center justify-center">
            <UserIcon className="w-5 h-5" />
          </div>
          <span className="text-sm font-medium text-primary-text hidden lg:block">
            {userEmail}
          </span>
        </button>

        {showMenu && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowMenu(false)}
            />

            {/* Menu */}
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
              <div className="p-3 border-b border-gray-200">
                <p className="text-sm font-medium text-primary-text">
                  Signed in as
                </p>
                <p className="text-xs text-gray-600 truncate">{userEmail}</p>
              </div>

              <div className="p-2">
                <button
                  onClick={() => {
                    setShowMenu(false)
                    setShowLogoutModal(true)
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {showLogoutModal && (
        <LogoutPopup
          cancel={() => setShowLogoutModal(false)}
          logout={handleConfirmLogout}
        />
      )}
    </>
  );
}
