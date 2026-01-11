import React from "react";
import { TopTradedAssets } from "./TopTradedAssets";
import { ArrowRight, Copy } from "lucide-react";
import { Button } from "../ui/button";

export const DoMore = () => {
  return (
    <div className="space-y-6 lg:space-y-0">
      <div className="flex lg:hidden">
        <TopTradedAssets />
      </div>

      <section className="w-full lg:bg-white lg:p-6 rounded-2xl flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h4 className="flex items-center gap-1.5 text-base text-primary-text font-bold tracking-[-0.012rem]">
            <img src="./icons/strike.svg" alt="Chart Icon" />
            Do more on Zabira!
          </h4>
        </div>

        <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 gap-9 lg:gap-6">
          <div
            className="relative h-full flex items-center justify-between gap-[1.8rem] p-4 lg:p-[1.47rem] rounded-[1.10194rem] border-[2.939px] border-white/18"
            style={{
              background:
                "linear-gradient(255deg, #00E8D1 -25.51%, #502DFF 108.99%)",
            }}
          >
            <img
              src="./images/do-more-human.svg"
              alt="Human Illustration"
              className="absolute bottom-0"
            />

            <div className="flex-1 space-y-2 lg:space-y-3 ml-auto pl-36 mt-4">
              <h3 className="text-base lg:text-xl font-bold text-white tracking-[-0.015rem]">
                Become a Merchant
              </h3>
              <p className="text-bas elg:text-lg font-medium text-white/70">
                Get access to APIs and assets for your merchant profile
              </p>
              <button className="flex h-9 min-h-9 px-3 py-0 justify-center items-center gap-1 rounded-md border border-base-border text-sm font-semibold text-primary-text bg-[#FCFCFC]">
                Apply Now
                <ArrowRight className="text-[#52525B] h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="w-full bg-transparent rounded-xl">
            <div className="p-4 flex justify-between items-center bg-[#7099FF] rounded-t-xl">
              <div className="flex items-center tetx-base lg:text-xl font-bold text-white gap-1.5 tracking-[-0.015rem]">
                <img src="./icons/flat-coins.svg" alt="Coins" />
                Refer and Earn
              </div>

              <div className="px-3 py-1 flex items-center gap-2 text-sm text-white font-semibold shadow-sm border border-primary-text/12 bg-primary-text/26 rounded-[3.125rem]">
                Referral Code
                <Copy className="w-4 h-4" />
              </div>
            </div>

            <div className="p-4 bg-[#EBF0FF] border border-white/12 space-y-6 rounded-b-xl">
              <p className="text-primary-text/70 text-base lg:text-lg font-medium tracking-[-0.0135rem]">
                Invite 10 people and get 100 points to use in amazing rewards!
                T&C Apply.
              </p>

              <Button
                size="lg"
                variant="outline"
                className="w-full bg-primary-text text-white text-base rounded-md"
              >
                Invite your friends
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
