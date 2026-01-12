"use client";

import React, { useState, useEffect } from "react";
import { Bell, Calculator, Headset, LogOut } from "lucide-react";
import { getCurrentUser, logout } from "@/app/utils/auth";
import { LogoutPopup } from "../dashboard/LogoutPopup";

export const Header: React.FC = () => {
  const [userEmail, setUserEmail] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setUserEmail(user.email);
    }
  }, []);

  // Extract first name from email for greeting
  const getFirstName = (email: string) => {
    const name = email.split("@")[0];
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  const handleConfirmLogout = () => {
    logout();
    setShowLogoutModal(false);
    setShowUserMenu(false);
  };

  return (
    <>
      <header className="hidden w-full lg:flex items-center justify-between h-21 px-12 py-5.5 bg-white shadow-[#52525B]/10 shadow-sm">
        <div className="space-y-1">
          <h3 className="text-primary-text text-base font-bold">
            Hi {userEmail ? getFirstName(userEmail) : "there"} 👋🏽
          </h3>
          <p className="text-primary-text/36 text-sm tracking-[-0.0105rem]">
            Buy/Sell BTC, ETH. Start trading now on Zabira
          </p>
        </div>

        <div className="flex items-center gap-12">
          <div className="min-w-fit h-9 border border-gray-200 bg-white rounded-2xl text-sm flex items-center divide-x divide-gray-200 shadow-sm">
            <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 font-semibold hover:bg-gray-50 transition-colors min-w-fit">
              <Calculator className="w-4 h-4" /> Check Rates
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 font-semibold hover:bg-gray-50 transition-colors min-w-fit">
              <Headset className="w-4 h-4" /> Get Help
            </button>
          </div>

          <div className="relative h-9 w-9 flex justify-center items-center rounded-full shadow-sm">
            <div className="bg-primary-blue w-4 h-4 rounded-full text-white text-[0.625rem] flex justify-center items-center absolute -top-1 -right-2">
              8
            </div>
            <Bell className="w-5 h-5" />
          </div>

          {/* User Menu with Logout */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="h-10 w-10 cursor-pointer flex justify-center items-center rounded-[2.25rem] bg-white border border-[#00DD77] hover:border-primary-blue transition-colors"
            >
              <img src="./icons/zabira.svg" alt="Zabira Logo" />
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowUserMenu(false)}
                />

                {/* Menu */}
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                  <div className="p-3 border-b border-gray-200">
                    <p className="text-xs text-primary-text font-medium">
                      Signed in as
                    </p>
                    <p className="text-sm text-primary-text font-semibold truncate mt-0.5">
                      {userEmail}
                    </p>
                  </div>

                  <div className="p-2">
                    <button
                      onClick={() => {
                    setShowUserMenu(false)
                    setShowLogoutModal(true)
                  }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>
      
      {showLogoutModal && (
        <LogoutPopup
          cancel={() => setShowLogoutModal(false)}
          logout={handleConfirmLogout}
        />
      )}
    </>
  );
};
