"use client";

import { X, Copy, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";

interface OTPToastProps {
  otp: string;
  show: boolean;
  onClose: () => void;
}

export function OTPToast({ otp, show, onClose }: OTPToastProps) {
  const [copied, setCopied] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
    }
  }, [show]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(otp);
      setCopied(true);
      setTimeout(() => setCopied(false), 1000);
      handleClose();
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  if (!show) return null;

  return (
    <div
      className={`fixed top-6 right-6 z-1000 transition-all duration-300 ease-out ${
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
    >
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 px-3 py-2">
        <div className="flex items-center gap-3">
          {/* Text */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700 font-medium">
              Verification Code:
            </span>
            <span className="text-base font-semibold text-gray-900 tracking-wider">
              {otp}
            </span>
          </div>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-100 rounded transition-colors flex items-center gap-1"
          >
            {copied ? (
              <>
                <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                <span className="text-green-600">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors ml-1"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Dev mode label */}
        <p className="text-xs text-gray-400 mt-1">(Dev mode)</p>
      </div>
    </div>
  );
}
