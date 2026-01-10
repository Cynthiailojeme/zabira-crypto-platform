"use client";

import { ArrowUpRight, ArrowDownRight, ArrowRight } from "lucide-react";
import { cn } from "../ui/utils";

type Asset = {
  id: string;
  name: string;
  symbol: string;
  icon: React.ReactNode;
  change: number;
};

const assets: Asset[] = [
  {
    id: "btc",
    name: "Bitcoin",
    symbol: "BTC",
    icon: <img src="./icons/bitcoin.svg" alt="Bitcoin Icon" />,
    change: 0.54,
  },
  {
    id: "amazon",
    name: "Amazon Giftcard",
    symbol: "",
    icon: <img src="./icons/amazon.svg" alt="Amazon Icon" />,
    change: 6.88,
  },
  {
    id: "eth",
    name: "Ethereum",
    symbol: "ETH",
    icon: <img src="./icons/ethereum.svg" alt="Ethereum Icon" />,
    change: -12.09,
  },
  {
    id: "spotify",
    name: "Spotify Premium",
    symbol: "",
    icon: <img src="./icons/spotify.svg" alt="Spotify Icon" />,
    change: 6.88,
  },
  {
    id: "usdt",
    name: "Tether",
    symbol: "USDT",
    icon: <img src="./icons/thether.svg" alt="Thether Icon" />,
    change: 6.88,
  },
];

export const TopTradedAssets = () => {
  return (
    <section className="grid">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h4 className="flex items-center gap-1.5 text-base text-primary-text font-bold tracking-[-0.012rem]">
          <img src="./icons/strike.svg" alt="Chart Icon" />
          Top traded assets this week
        </h4>

        <button className="text-white text-sm flex items-center justify-between py-0.5 px-2 rounded-[3.125rem] font-semibold border border-white/12 bg-primary-text transition hover:opacity-90">
          <span>Trade Now</span> <ArrowRight className="text-white h-4 w-4" />
        </button>
      </div>

      {/* Cards */}
      <div className="w-full overflow-x-auto scrollbar-hide">
        <div className="flex gap-3 pb-1">
          {assets.map((asset) => {
            const isPositive = asset.change >= 0;

            return (
              <div
                key={asset.id}
                className="w-34 shrink-0 rounded-2xl bg-white lg:bg-[#F4F4F5] border border-[#F4F4F5] lg:border-none p-4 transition hover:bg-gray-200 shadow-sm lg:shadow-none"
              >
                <div className="mb-3 flex h-fit w-fit items-center justify-center rounded-full">
                  {asset.icon}
                </div>

                <p className="text-sm font-semibold line-clamp-1">
                  {asset.name}
                  {asset.symbol && (
                    <span className="text-gray-500"> ({asset.symbol})</span>
                  )}
                </p>

                <div className="mt-2 flex items-center gap-2 text-sm font-medium">
                  <span className="text-primary-text/70">
                    {isPositive ? "+" : ""}
                    {asset.change}%
                  </span>

                  <span
                    className={cn(
                      "flex h-5 w-5 items-center justify-center rounded-full",
                      isPositive ? "bg-[#1AC057]" : "bg-[#EF4343]"
                    )}
                  >
                    {isPositive ? (
                      <ArrowUpRight className="h-3 w-3 text-white" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 text-white" />
                    )}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="hidden lg:flex items-center justify-end gap-3 mt-9 text-base font-semibold text-primary-text cursor-pointer">
        <img src="./icons/coins.svg" alt="Chart Icon" /> Earn Rewards{" "}
        <ArrowRight className="text-[#52525B] text-xs" />
      </div>
    </section>
  );
};
