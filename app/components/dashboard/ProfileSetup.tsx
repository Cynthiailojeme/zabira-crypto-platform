import { ArrowRight, ChevronRight } from "lucide-react";

export default function ProfileSetup({
  completedSteps,
  completeSetUp,
}: {
  completedSteps: number;
  completeSetUp: () => void;
}) {
  const totalSteps = 6;
  const progress = (completedSteps / totalSteps) * 100;

  return (
    <div
      onClick={() => completeSetUp()}
      className="flex p-4 items-start lg:items-center gap-4 lg:gap-6 justify-between rounded-xl border-2 border-[#A3D4FF] bg-[#D6ECFF]"
    >
      {/* Progress Circle */}
      <div className="flex items-center gap-4 lg:gap-6">
        <div className="relative w-14 h-14 shrink-0">
          <svg className="w-14 h-14 transform -rotate-90" viewBox="0 0 64 64">
            {/* Background circle */}
            <circle
              cx="32"
              cy="32"
              r="28"
              fill="transparent"
              stroke="#FFFFFF"
              strokeWidth="6"
            />
            {/* Progress circle */}
            <circle
              cx="32"
              cy="32"
              r="28"
              fill="none"
              stroke="#299BFF"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 28}`}
              strokeDashoffset={`${2 * Math.PI * 28 * (1 - progress / 100)}`}
              className="transition-all duration-500"
            />
          </svg>
          {/* Text in center */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[1.09375rem] leading-[1.05rem] font-bold text-primary-text">
              {completedSteps}/{totalSteps}
            </span>
          </div>
        </div>

        {/* Text Content */}
        <div className="flex-1">
          <h3 className="text-base lg:text-xl font-bold text-[#00298F] leading-[1.55rem] trackin-[-0.015rem] mb-1">
            You're almost done!
          </h3>
          <p className="text-sm lg:text-base text-primary-text/70 leading-[1.24rem]">
            Finish setting up your account to enjoy benefits
          </p>
        </div>
      </div>

      <button onClick={() => completeSetUp()} className="lg:hidden flex">
        <ChevronRight className="h-5 w-5 text-primary-text/36" />
      </button>

      {/* CTA Button */}
      <button
        onClick={() => completeSetUp()}
        className="hidden lg:flex items-center gap-2 px-3 h-9 bg-[#1A1A1A] text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors shrink-0"
      >
        Complete Profile Setup
        <ArrowRight className="h-5 w-5 text-white" />
      </button>
    </div>
  );
}
