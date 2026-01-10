"use client";

import React from "react";
import { Bell, Calculator, Headset } from "lucide-react";

export const Header: React.FC = () => {
  const user = {
    name: "Jacob",
    role: "Administrator",
    imageUrl: "/images/user-avatar.png",
  };

  return (
    <header className="hidden w-full lg:flex items-center justify-between h-21 px-12 py-5.5 bg-white shadow-[#52525B]/10 shadow-sm">
      <div className="space-y-1">
        <h3 className="text-primary-text text-base font-bold">Hi {user.name} 👋🏽</h3>
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

        <div className="h-10 w-10 flex justify-center items-center rounded-[2.25rem] bg-white border border-[#00DD77]">
          <img src="./icons/zabira.svg" alt="Zabira Logo" />
        </div>
      </div>
    </header>
  );
};
