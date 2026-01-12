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

  const handleCurrencySelect = (currencyCode: string) => {
    setActiveCurrency(currencyCode);
    setIsDropdownOpen(false);
  };

  return (
    <div
      className="lg:hidden w-full flex flex-col bg-[#477CFF] rounded-xl border border-[#DADFED]"
      style={{
        backgroundColor: "#EBF0FF",
        borderColor: "#DADFED",
      }}
    >
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
                  onTouchEnd={() => setIsDropdownOpen(false)}
                />

                <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg overflow-hidden z-20">
                  {currencies.map((currency) => (
                    <button
                      key={currency.code}
                      type="button"
                      onClick={() => handleCurrencySelect(currency.code)}
                      onTouchEnd={(e) => {
                        e.preventDefault();
                        handleCurrencySelect(currency.code);
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

      <div className="h-fit flex items-center justify-between px-3 py-1.5">
        <div className="flex items-center gap-1.5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              d="M13.3333 14.6663H2.66667C2.48986 14.6663 2.32029 14.5961 2.19526 14.4711C2.07024 14.3461 2 14.1765 2 13.9997V1.99967C2 1.82286 2.07024 1.65329 2.19526 1.52827C2.32029 1.40325 2.48986 1.33301 2.66667 1.33301H13.3333C13.5101 1.33301 13.6797 1.40325 13.8047 1.52827C13.9298 1.65329 14 1.82286 14 1.99967V13.9997C14 14.1765 13.9298 14.3461 13.8047 14.4711C13.6797 14.5961 13.5101 14.6663 13.3333 14.6663ZM5.33333 4.66634V5.99967H10.6667V4.66634H5.33333ZM5.33333 7.33301V8.66634H10.6667V7.33301H5.33333ZM5.33333 9.99967V11.333H8.66667V9.99967H5.33333Z"
              fill="#477CFF"
            />
          </svg>
          <span className="text-sm font-semibold text-primary-text/70 tracking-[-0.0105rem]">
            Transaction History
          </span>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="12"
          viewBox="0 0 16 12"
          fill="none"
        >
          <path
            d="M12.7858 5.94985L8.54285 1.70685C8.15238 1.31638 8.15238 0.683314 8.54285 0.292849C8.93331 -0.0976164 9.56638 -0.0976163 9.95685 0.292849L14.9067 5.24274C15.2973 5.63327 15.2973 6.26643 14.9067 6.65696L9.95685 11.6068C9.56638 11.9973 8.93331 11.9973 8.54285 11.6068C8.15238 11.2164 8.15238 10.5833 8.54285 10.1929L12.7858 5.94985Z"
            fill="#1A1A1A"
            fillOpacity="0.48"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0 6C6.58593e-09 5.44772 0.447715 5 1 5H13.5C14.0523 5 14.5 5.44772 14.5 6C14.5 6.55228 14.0523 7 13.5 7H1C0.447715 7 -6.58593e-09 6.55228 0 6Z"
            fill="#1A1A1A"
            fillOpacity="0.48"
          />
        </svg>
      </div>
    </div>
  );
};
