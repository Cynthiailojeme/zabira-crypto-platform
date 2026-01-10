"use client";

import {
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight,
  Gift,
  Volleyball,
  Calculator,
  Link,
  Ellipsis,
} from "lucide-react";
import { cn } from "../ui/utils";

type payment = {
  id: string;
  name: string;
  color: string;
  icon: React.ReactNode;
  description: string;
};

const payments: payment[] = [
  {
    id: "giftcard",
    name: "Giftcard",
    color: "bg-[#07B4D3]",
    icon: <Gift className="text-white h-5 w-5" />,
    description: "Trade giftcards easily and fast.",
  },
  {
    id: "crypto",
    name: "Crypto",
    color: "bg-[#F67416]",
    icon: <img src="./icons/bitcoin-white.svg" alt="Crypto Icon" />,
    description: "Quickly trade cryptocurrencies",
  },
  {
    id: "pay-bills",
    name: "Pay Bills",
    color: "bg-[#E7B008]",
    icon: <img src="./icons/phone-white.svg" alt="Pay Bills Icon" />,
    description: "Airtime, data, cable, betting, electricity.",
  },
  {
    id: "pay-link",
    name: "Pay Link",
    color: "bg-[#7BC111]",
    icon: <Link className="text-white h-5 w-5" />,
    description: "Get paid in seconds with payment links.",
  },
  {
    id: "rates",
    name: "Rates",
    color: "bg-[#A855F7]",
    icon: <Calculator className="text-white h-5 w-5" />,
    description: "Check current rates in realtime.",
  },
  {
    id: "betting",
    name: "Betting",
    color: "bg-[#6B6EF8]",
    icon: <Volleyball className="text-white h-5 w-5" />,
    description: "Fund betting accounts fast.",
  },
  {
    id: "merchant",
    name: "Merchant",
    color: "bg-[#10B77F]",
    icon: <img src="./icons/apps-circle.svg" alt="Merchant Icon" />,
    description: "Fund betting accounts fast.",
  },
  {
    id: "more",
    name: "More",
    color: "bg-[#A1A1AA]",
    icon: <Ellipsis className="text-white h-5 w-5" />,
    description: "Fund betting accounts fast.",
  },
];

export const Payments = () => {
  return (
    <section className="w-full lg:bg-white lg:p-6 rounded-2xl flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h4 className="flex items-center gap-1.5 text-lg text-primary-text font-bold tracking-[-0.012rem]">
          <img src="./icons/strike.svg" alt="Chart Icon" />
          Start Making Payments
        </h4>
      </div>

      {/* Cards */}
      <div
        className="
          grid grid-cols-4 gap-3
          lg:gap-6
          lg:grid-cols-[repeat(auto-fit,minmax(10rem,1fr))]
        "
      >
        {payments.map((payment, index) => {
          return (
            <div
              key={payment.id}
              className={`
                flex flex-col items-center lg:items-start
                rounded-xl bg-[#F4F4F5] lg:bg-[#FCFCFC]
                lg:border border-[#F4F4F5]
                p-3 lg:p-4
                transition shadow-sm lg:shadow-none
                ${index >= 6 ? "lg:hidden" : ""}
              `}
            >
              <div
                className={`mb-3 flex h-9 w-9 items-center justify-center rounded-full ${payment.color}`}
              >
                {payment.icon}
              </div>

              <p className="text-sm lg:text-base font-semibold lg:line-clamp-1 tracking-[-0.0105rem] lg:tracking-[-0.012rem]">
                {payment.name}
              </p>

              <span className="hidden lg:flex text-primary-text/36 text-sm font-medium tracking-[-0.0105rem] leading-[1.24rem]">
                {payment.description}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
};
