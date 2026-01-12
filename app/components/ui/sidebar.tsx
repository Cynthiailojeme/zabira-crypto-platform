"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { Bell, Menu, X } from "lucide-react";
import Link from "next/link";

export interface AppRoutes {
  name: string;
  href: string;
  icon: string;
}

export const routes: AppRoutes[] = [
  { name: "Dashboard", href: "/", icon: "./icons/home.svg" },
  { name: "Giftcard", href: "/giftcard", icon: "./icons/gift-card.svg" },
  { name: "Bill Payment", href: "/bill-payment", icon: "./icons/phone.svg" },
  { name: "Wallet", href: "/wallet", icon: "./icons/wallet.svg" },
  {
    name: "Transactions",
    href: "/transactions",
    icon: "./icons/transactions.svg",
  },
  { name: "Rewards", href: "/rewards", icon: "./icons/rewards.svg" },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden h-fit w-full z-50 fixed flex items-center justify-between p-5 border-b border-[#E0F1FF] bg-white">
        <div className="flex items-center gap-4">
          <button onClick={() => setOpen(true)}>
            <Menu className="w-[1.62569rem] h-[1.62569rem" />
          </button>
          <img
            src="./images/z-logo-dark.svg"
            alt="Zabira Logo"
            className="h-6"
          />
        </div>

        <div className="flex items-center gap-6">
          <div className="relative h-4 w-4 flex justify-center items-center rounded-full shadow-sm">
            <div className="bg-[#00DD77] w-4 h-4 rounded-full text-white text-[0.625rem] flex justify-center items-center absolute -top-1 -right-2">
              8
            </div>
            <Bell className="w-7 h-7" />
          </div>

          <div className="h-8 w-8 flex justify-center items-center rounded-[2.25rem] bg-white border border-[#85C5FF]">
            <img src="./icons/zabira.svg" alt="Zabira Logo" />
          </div>
        </div>
      </div>

      {/* Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}

      {/* Sidebar */}
      <nav
        key={pathname}
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-[16rem] bg-white border border-foreground
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <div className="flex flex-col h-full py-6 px-4 overflow-y-auto scrollbar-hide">
          {/* Mobile Close */}
          <div className="md:hidden flex justify-end mb-4">
            <button onClick={() => setOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>

          <a href="/" className="hidden md:block">
            <img src="./images/z-logo-dark.svg" alt="Zabira Logo" />
          </a>

          <div className="mt-0 lg:mt-9">
            {routes.map((route) => (
              <Link
                href={route?.href}
                onClick={() => setOpen(false)} // close mobile menu
                key={route?.href}
                className={`${
                  pathname === route?.href ? "bg-[#EBF0FF]" : "bg-transparent"
                } relative group rounded flex items-center transition-all duration-300 ease-out p-3 gap-3`}
              >
                <img
                  src={route.icon}
                  className="w-4 h-4 transition-all duration-300 ease-out"
                  style={{
                    filter:
                      pathname === route.href
                        ? "brightness(0) saturate(100%) invert(21%) sepia(100%) saturate(6295%) hue-rotate(226deg) brightness(93%) contrast(104%)" // #0044EE
                        : "brightness(0) saturate(100%) invert(66%) sepia(4%) saturate(450%) hue-rotate(202deg) brightness(98%) contrast(91%);", // #A1A1AA
                  }}
                />
                <span
                  className={`${
                    pathname === route?.href
                      ? "text-primary-blue"
                      : "text-primary-text/36"
                  } text-sm font-medium leading-5.25 whitespace-nowrap transition-all duration-300 ease-out`}
                >
                  {route?.name}
                </span>
              </Link>
            ))}
          </div>

          <Link
            onClick={() => setOpen(false)}
            href="/settings"
            className={`${
              pathname === "/settings" ? "bg-[#EBF0FF]" : "bg-transparent"
            } relative group rounded flex items-center transition-all duration-300 ease-out p-3 gap-3 mt-5`}
          >
            <img
              src="./icons/settings.svg"
              style={{
                filter:
                  pathname === "/settings"
                    ? "brightness(0) saturate(100%) invert(21%) sepia(100%) saturate(6295%) hue-rotate(226deg) brightness(93%) contrast(104%)" // #0044EE
                    : "brightness(0) saturate(100%) invert(66%) sepia(4%) saturate(450%) hue-rotate(202deg) brightness(98%) contrast(91%);", // #A1A1AA
              }}
            />
            <span
              className={`${
                pathname === "/settings"
                  ? "text-primary-blue"
                  : "text-primary-text/36"
              } text-sm font-medium leading-5.25 whitespace-nowrap transition-all duration-300 ease-out`}
            >
              Settings
            </span>
          </Link>

          <div className="my-5">
            <img src="./images/refer-banner.svg" alt="Refer and Win Banner" />
          </div>

          <div className="flex flex-col  text-sm tracking-[-0.0105rem] px-6">
            <p className="text-[#819099] font-semibold mb-3">
              Download the Zabira App
            </p>
            <img src="./images/qr-code.svg" alt="QR Code" />
            <span className="min-w-fit text-primary-text/70 font-semibold mt-5">
              Zabira Technologies
            </span>
            <span className="min-w-fit text-primary-text/36 font-normal mt-2">
              © 2027 All Rights Reserved
            </span>
          </div>
        </div>
      </nav>
    </>
  );
};
