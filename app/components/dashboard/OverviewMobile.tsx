import { ChevronDown, Eye, EyeOff, MoveDownLeft, MoveUpRight } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";

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
  return (
    <div className="lg:hidden w-full flex flex-col">
      <div className="relative bg-primary-blue p-5 rounded-xl">
        <div
            className="absolute inset-0 transition-opacity duration-700"
          >
            <img
              src='./images/bg-wallet.svg'
              alt=""
              className="w-full h-full object-cover opacity-60"
            />
          </div>
        <div className="w-full flex justify-between">
          <div className="flex items-center gap-3">
            <h3 className="font-semibold text-white/70">Total Balance</h3>
            <button onClick={() => setShowBalance(!showBalance)}>
              {showBalance ? (
                <EyeOff className="text-white h-5 w-5" />
              ) : (
                <Eye className="text-white h-5 w-5" />
              )}
            </button>
          </div>

          <div className="flex justify-center items-center text-white tracking-[-0.012rem] rounded-[3.125rem] border border-white/26 bg-white/18 px-2">
            <span>{activeCurrency}</span>
            <ChevronDown className="text-white" />
          </div>
        </div>

        <h1 className="text-white font-bold text-[2rem] tracking-[-0.024rem] my-2">
          {showBalance ? "10,254.02" : "******"}
        </h1>

        <div className="h-px w-full bg-white/26"></div>

        <div className="flex items-center justify-around">
          <Button
            size="lg"
            variant="link"
            className="flex items-center gap-2 text-white rounded-none bg-transparent"
          >
            <MoveUpRight /> <span>Withdraw</span>
          </Button>

          <div className="w-px h-5.5 bg-white/26"></div>

          <Button
            size="lg"
            variant="link"
            className="flex items-center gap-2 text-white bg-transparent"
          >
            <MoveDownLeft /> <span>Deposit</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
