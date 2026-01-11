import React from "react";
import {
  ArrowLeftRight,
  Eye,
  EyeOff,
  MoveDownLeft,
  MoveUpRight,
} from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { TopTradedAssets } from "./TopTradedAssets";
import { cn } from "../ui/utils";
import { OverviewMobile } from "./OverviewMobile";

type Currency = {
  code: string;
  label: string;
  flag: React.ReactNode;
};

export const currencies: Currency[] = [
  {
    code: "USD",
    label: "USD",
    flag: <img src="./icons/usa.svg" alt="USA Flag" className="rounded-full" />,
  },
  {
    code: "NGN",
    label: "NGN",
    flag: <img src="./icons/ngn.svg" alt="NGN Flag" className="rounded-full" />,
  },
  {
    code: "GHC",
    label: "GHC",
    flag: <img src="./icons/ghc.svg" alt="GHC Flag" className="rounded-full" />,
  },
  {
    code: "KES",
    label: "KES",
    flag: <img src="./icons/ghc.svg" alt="KES Flag" className="rounded-full" />,
  },
];

export const Overview = () => {
  const [showBalance, setShowBalance] = useState(true);
  const [activeCurrency, setActiveCurrency] = useState("USD");

  return (
    <>
      <OverviewMobile
        showBalance={showBalance}
        setShowBalance={setShowBalance}
        activeCurrency={activeCurrency}
        setActiveCurrency={setActiveCurrency}
      />

      <div className="hidden w-full bg-white p-6 rounded-2xl lg:flex gap-6">
        <div className="flex flex-col gap-6">
          <div className="py-4 px-6 bg-[#EBF0FF] border-[#D6E2FF] border rounded-xl flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <h3 className="font-semibold text-primary-text/70">
                  Total Balance
                </h3>
                <button onClick={() => setShowBalance(!showBalance)}>
                  {showBalance ? (
                    <EyeOff className="text-[#A1A1AA] text-lg" />
                  ) : (
                    <Eye className="text-[#A1A1AA] text-lg" />
                  )}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <h1 className="text-primary-text font-bold text-[2rem] tracking-[-0.024rem]">
                  {showBalance ? "10,254.02" : "******"}
                </h1>
                <div className="flex justify-center items-center text-primary-blue tracking-[-0.012rem] rounded-[3.125rem] border border-[#ADC5FF] bg-[#D6E2FF] py-1 px-3">
                  <span>{activeCurrency}</span>
                </div>
              </div>
            </div>

            <div className="flex w-fit rounded-md bg-[#D6E2FF] p-1">
              {currencies.map((currency) => {
                const isActive = activeCurrency === currency.code;

                return (
                  <button
                    key={currency.code}
                    type="button"
                    onClick={() => setActiveCurrency(currency.code)}
                    className={cn(
                      "flex items-center gap-2 rounded-lg px-3 text-sm font-medium transition-all",
                      isActive
                        ? "bg-white text-primary-base font-semibold shadow-md"
                        : "text-primary-base/70"
                    )}
                  >
                    {currency.label}
                    <div className="rounded-full h-8.5 w-8.5 flex items-center justify-center">
                      {currency.flag}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <Button
              size="lg"
              variant="outline"
              className="w-fit lg:w-full gap-2 text-primary-text rounded-md border-base-border bg-base-surface"
            >
              <MoveUpRight /> <span className="hidden lg:flex">Withdraw</span>
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="w-fit lg:w-full gap-2 text-primary-text rounded-md border-base-border bg-base-surface"
            >
              <MoveDownLeft />
              <span className="hidden lg:flex">Deposit</span>
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="w-fit lg:w-full gap-2 text-primary-text rounded-md border-base-border bg-base-surface"
            >
              <ArrowLeftRight />
              <span className="hidden lg:flex">Swap</span>
            </Button>
          </div>
        </div>

        <TopTradedAssets />
      </div>
    </>
  );
};
