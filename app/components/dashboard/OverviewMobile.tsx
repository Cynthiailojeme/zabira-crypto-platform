"use client";
import {
  ChevronDown,
  Eye,
  EyeOff,
  MoveDownLeft,
  MoveUpRight,
} from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import { currencies } from "./Overview";

export const OverviewMobile = ({
  showBalance,
  setShowBalance,
  activeCurrency,
  setActiveCurrency,
}: {
  showBalance: boolean;
  setShowBalance: (val: boolean) => void;
  activeCurrency: string;
  setActiveCurrency: (val: string) => void;
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="lg:hidden w-full flex flex-col">
      <div className="relative bg-primary-blue p-5 rounded-xl">
        <div className="absolute inset-0 transition-opacity duration-700">
          <img
            src="./images/bg-wallet.svg"
            alt=""
            className="w-full h-full object-cover opacity-60"
          />
        </div>
        <div className="w-full flex justify-between relative z-10">
          <div className="flex items-center gap-3">
            <h3 className="font-semibold text-white/70">Total Balance</h3>
            <button type="button" onClick={() => setShowBalance(!showBalance)}>
              {showBalance ? (
                <EyeOff className="text-white h-5 w-5" />
              ) : (
                <Eye className="text-white h-5 w-5" />
              )}
            </button>
          </div>

          {/* Currency Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex justify-center items-center text-white tracking-[-0.012rem] rounded-[3.125rem] border border-white/26 bg-white/18 px-2 hover:bg-white/25 transition-colors"
            >
              <span>{activeCurrency}</span>
              <ChevronDown
                className={`text-white transition-transform ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <>
                {/* Backdrop to close dropdown */}
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsDropdownOpen(false)}
                />

                <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg overflow-hidden z-20">
                  {currencies.map((currency) => (
                    <button
                      key={currency.code}
                      type="button"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        setActiveCurrency(currency.code);
                      }}
                      className={`w-full flex items-center gap-2 px-3 py-2.5 hover:bg-gray-100 transition-colors ${
                        activeCurrency === currency.code
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-700"
                      }`}
                    >
                      <span className="w-5 h-5">{currency.flag}</span>
                      <span className="font-medium">{currency.label}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <h1 className="text-white font-bold text-[2rem] tracking-[-0.024rem] my-2 relative z-10">
          {showBalance ? "10,254.02" : "******"}
        </h1>

        <div className="h-px w-full bg-white/26 relative z-10"></div>

        <div className="flex items-center justify-around relative z-10">
          <Button
            size="lg"
            variant="link"
            type="button"
            className="flex items-center gap-2 text-white rounded-none bg-transparent"
          >
            <MoveUpRight /> <span>Withdraw</span>
          </Button>

          <div className="w-px h-5.5 bg-white/26"></div>

          <Button
            size="lg"
            variant="link"
            type="button"
            className="flex items-center gap-2 text-white bg-transparent"
          >
            <MoveDownLeft /> <span>Deposit</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
