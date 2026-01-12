import { CarouselSidebar } from "../components/auth/CarouselSlider";
import { Calculator, Headset } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen bg-[#FFFFFF] lg:bg-[#F4F4F5] p-6 lg:p-4 relative flex gap-4">
      {/* Left Panel - Branded Section */}
      <CarouselSidebar />

      {/* Right Panel */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Header */}
        <header className="flex gap-2 justify-between lg:justify-end mb-12 shrink-0">
          <img
            src="./images/z-logo-dark.svg"
            alt="Zabira Logo"
            className="flex lg:hidden"
          />
          <div className="min-w-fit h-9 border border-gray-200 bg-white rounded-2xl text-sm flex items-center divide-x divide-gray-200 shadow-sm">
            <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 font-semibold hover:bg-gray-50 transition-colors min-w-fit">
              <Calculator className="w-4 h-4" />{" "}
              <span className="hidden lg:flex">Check Rates</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 font-semibold hover:bg-gray-50 transition-colors min-w-fit">
              <Headset className="w-4 h-4" />{" "}
              <span className="hidden lg:flex">Get Help</span>
            </button>
          </div>
        </header>

        {/* Main Content - Scrollable */}
        <div className="flex-1 overflow-y-auto min-h-0 scrollbar-hide">
          <div className="flex items-center justify-center min-h-full">
            {children}
          </div>
        </div>

        {/* Footer */}
        <footer className="flex justify-between text-sm text-gray-600 px-0 lg:px-9 py-4 shrink-0">
          <span className="min-w-fit">© Zabira, 2026</span>
          <div className="hidden lg:flex gap-6 min-w-fit">
            <a href="#" className="hover:text-gray-900 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-gray-900 transition-colors">
              Terms of Service
            </a>
          </div>

          <div className="lg:hidden flex gap-6 justify-between min-w-fit">
            <a href="#" className="hover:text-gray-900 transition-colors">
              Policy
            </a>
            <a href="#" className="hover:text-gray-900 transition-colors">
              Terms
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}
