"use client";

import { useState, useEffect } from "react";
import { Eye, EyeOff, Mail, Lock, ShieldCheck } from "lucide-react";
import { Input } from "@/app/components/ui/input";
import { Checkbox } from "@/app/components/ui/checkbox";
import { Button } from "@/app/components/ui/button";
import { useFormik } from "formik";
import {
  PasswordStrengthIndicator,
  ValidationRequirements,
} from "@/app/components/auth/PasswordStrength";
import { signupSchema } from "@/app/utils/validations";
import { OTPToast } from "@/app/components/dashboard/OTPToast";

const ReferallIcon: React.FC<React.SVGProps<SVGSVGElement>> = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
  >
    <circle cx="6" cy="4" r="2" stroke="currentColor" strokeWidth="1.5" />
    <ellipse cx="6" cy="8" rx="3" ry="2" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="18" cy="16" r="2" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M22 12C22 6.47715 17.5228 2 12 2M12 22C6.47715 22 2 17.5228 2 12"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <ellipse cx="18" cy="20" rx="3" ry="2" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

export const promoSlides = [
  {
    id: 1,
    content: (
      <div className="relative flex gap-3 p-4 rounded-xl border-2 border-[rgba(255,255,255,0.18)] bg-[linear-gradient(93deg,#5B129F_11.27%,#9234EA_75.65%,#521D84_112.1%)]">
        <div className="text-white text-base font-bold tracking-[-0.012rem] leading-[1.24rem] relative z-10">
          Speed UP Your Crypto, Gift Card & Bill <br /> Payments
        </div>
        <img
          src="./images/cash.svg"
          alt="Cash Background"
          className="absolute right-0 top-0 bg-no-repeat"
        />
      </div>
    ),
  },
  {
    id: 2,
    content: (
      <div className="relative flex gap-3 p-4 rounded-xl border-2 border-white/18 bg-[linear-gradient(67deg,#3F9906_-90.03%,#C3BC02_-7.9%,#4B9C06_52.41%,#FC0_153.78%)]">
        <img
          src="./images/sell-gain-bg.svg"
          alt="Sell & Gain Background"
          className="absolute left-0 top-0 bg-no-repeat"
        />
        <img src="./images/coins.svg" alt="Coins" className="relative z-10" />
        <div className="text-white text-base font-bold tracking-[-0.012rem] leading-[1.24rem]">
          SELL & GAIN up to ₦50 on every <br /> $ Crypto Trade
        </div>
      </div>
    ),
  },
  {
    id: 3,
    content: (
      <div className="relative flex gap-3 p-4 rounded-xl border-2 border-[rgba(255,255,255,0.18)] bg-[linear-gradient(93deg,#5B129F_11.27%,#9234EA_75.65%,#521D84_112.1%)]">
        <div className="text-white text-base font-bold tracking-[-0.012rem] leading-[1.24rem] relative z-10">
          Speed UP Your Crypto, Gift Card & Bill <br /> Payments
        </div>
        <img
          src="./images/cash.svg"
          alt="Cash Background"
          className="absolute right-0 top-0 bg-no-repeat"
        />
      </div>
    ),
  },
  {
    id: 4,
    content: (
      <div className="relative flex gap-3 p-4 rounded-xl border-2 border-white/18 bg-[linear-gradient(67deg,#3F9906_-90.03%,#C3BC02_-7.9%,#4B9C06_52.41%,#FC0_153.78%)]">
        <img
          src="./images/sell-gain-bg.svg"
          alt="Sell & Gain Background"
          className="absolute left-0 top-0 bg-no-repeat"
        />
        <img src="./images/coins.svg" alt="Coins" className="relative z-10" />
        <div className="text-white text-base font-bold tracking-[-0.012rem] leading-[1.24rem]">
          SELL & GAIN up to ₦50 on every <br /> $ Crypto Trade
        </div>
      </div>
    ),
  },
  {
    id: 5,
    content: (
      <div className="relative flex gap-3 p-4 rounded-xl border-2 border-[rgba(255,255,255,0.18)] bg-[linear-gradient(93deg,#5B129F_11.27%,#9234EA_75.65%,#521D84_112.1%)]">
        <div className="text-white text-base font-bold tracking-[-0.012rem] leading-[1.24rem] relative z-10">
          Speed UP Your Crypto, Gift Card & Bill <br /> Payments
        </div>
        <img
          src="./images/cash.svg"
          alt="Cash Background"
          className="absolute right-0 top-0 bg-no-repeat"
        />
      </div>
    ),
  },
  {
    id: 6,
    content: (
      <div className="relative flex gap-3 p-4 rounded-xl border-2 border-white/18 bg-[linear-gradient(67deg,#3F9906_-90.03%,#C3BC02_-7.9%,#4B9C06_52.41%,#FC0_153.78%)]">
        <img
          src="./images/sell-gain-bg.svg"
          alt="Sell & Gain Background"
          className="absolute left-0 top-0 bg-no-repeat"
        />
        <img src="./images/coins.svg" alt="Coins" className="relative z-10" />
        <div className="text-white text-base font-bold tracking-[-0.012rem] leading-[1.24rem]">
          SELL & GAIN up to ₦50 on every <br /> $ Crypto Trade
        </div>
      </div>
    ),
  },
];

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // OTP Toast state
  const [showOTPToast, setShowOTPToast] = useState(false);
  const [generatedOTP, setGeneratedOTP] = useState("");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % promoSlides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      referralCode: "",
      agreeToTerms: false,
    },
    validationSchema: signupSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      setApiError(null);

      try {
        const response = await fetch("/api/auth/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        const data = await response.json();

        if (!response.ok) {
          // Handle error responses
          setApiError(data.error || "An error occurred during signup");
          return;
        }

        // Success! Store verification data in localStorage
        localStorage.setItem(
          "pendingVerification",
          JSON.stringify({
            email: values.email,
            userId: data.user.id,
            debug: data.debug, // Contains OTP in development
          })
        );

        // Show OTP in toast notification
        if (data.debug?.otp) {
          setGeneratedOTP(data.debug.otp);
          setUserEmail(values.email);
          setShowOTPToast(true);

          // Auto-redirect after 3 seconds (or user can close toast to redirect immediately)
          setTimeout(() => {
            window.location.href =
              "/verify-email?email=" + encodeURIComponent(values.email);
          }, 3000);
        } else {
          // If no debug OTP (production), redirect immediately
          window.location.href =
            "/verify-email?email=" + encodeURIComponent(values.email);
        }
      } catch (error) {
        console.error("Signup error:", error);
        setApiError(
          "Network error. Please check your connection and try again."
        );
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleToastClose = () => {
    setShowOTPToast(false);
    // Redirect to verification page when toast is closed
    window.location.href =
      "/verify-email?email=" + encodeURIComponent(userEmail);
  };

  return (
    <div className="w-full max-w-full lg:max-w-125 flex flex-col items-center gap-6 mb-20">
      <form
        onSubmit={formik.handleSubmit}
        className="w-full flex flex-col gap-6 p-0 lg:p-9 bg-transparent lg:bg-white rounded-2xl shadow-custom"
      >
        {/* Title */}
        <h2 className="text-2xl font-bold text-primary-text">
          Create an account in 2 minutes!
        </h2>

        {/* API Error Display */}
        {apiError && (
          <div className="p-4 rounded-lg bg-red-50 border border-red-200">
            <p className="text-sm text-red-600">{apiError}</p>
          </div>
        )}

        {/* Promo Slideshow */}
        <div className="relative overflow-hidden">
          {promoSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`transition-opacity duration-500 ${
                index === currentSlide ? "opacity-100" : "opacity-0 hidden"
              }`}
            >
              {slide.content}
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="Type your email"
            icon={Mail}
            {...formik.getFieldProps("email")}
            error={
              formik.touched.email && formik.errors.email
                ? formik.errors.email
                : undefined
            }
            disabled={isSubmitting}
          />

          <div>
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              icon={Lock}
              rightIcon={showPassword ? EyeOff : Eye}
              {...formik.getFieldProps("password")}
              error={
                formik.touched.password && formik.errors.password
                  ? formik.errors.password
                  : undefined
              }
              onRightIconClick={() => setShowPassword(!showPassword)}
              disabled={isSubmitting}
            />

            {formik.touched.password ? (
              <>
                <PasswordStrengthIndicator password={formik.values.password} />
                <ValidationRequirements password={formik.values.password} />
              </>
            ) : null}
          </div>

          <Input
            label="Referral Code (Optional)"
            type="text"
            placeholder="Enter referral code"
            icon={ReferallIcon}
            {...formik.getFieldProps("referralCode")}
            disabled={isSubmitting}
          />

          {/* Terms Checkbox */}
          <div>
            <div className="flex items-start gap-2 mt-1">
              <Checkbox
                id="terms"
                checked={formik.values.agreeToTerms}
                onCheckedChange={(checked) =>
                  formik.setFieldValue("agreeToTerms", checked)
                }
                onBlur={formik.handleBlur}
                name="agreeToTerms"
                disabled={isSubmitting}
              />
              <label
                htmlFor="terms"
                className="text-sm font-medium text-primary-text/70 leading-[1.225rem] tracking-[-0.00875rem] cursor-pointer"
              >
                By clicking 'Sign Up', I agree to Zabira's{" "}
                <a href="#" className="text-primary-blue hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-primary-blue hover:underline">
                  Privacy Policy
                </a>
                .
              </label>
            </div>
            {formik.touched.agreeToTerms && formik.errors.agreeToTerms && (
              <p className="mt-1.5 text-sm text-primary-alert">
                {formik.errors.agreeToTerms}
              </p>
            )}
          </div>
        </div>

        {/* Sign Up Button */}
        <Button
          size="lg"
          variant="outline"
          type="submit"
          disabled={!formik.isValid || !formik.dirty || isSubmitting}
          className="min-h-11 w-full gap-2 bg-primary-text text-white rounded-md hover:text-white disabled:bg-[#F4F4F5] disabled:border-none disabled:text-primary-text/18"
        >
          {isSubmitting ? (
            <>
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span className="flex font-semibold text-base">
                Creating Account...
              </span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-6 h-6" />
              <span className="flex font-semibold text-base">Sign Up</span>
            </>
          )}
        </Button>

        {/* Divider */}
        <div className="relative flex justify-center text-sm">
          <span className="px-4 text-primary-text/70">Or continue with</span>
        </div>

        {/* Social Login Buttons */}
        <div className="flex justify-center lg:grid grid-cols-2 gap-3">
          <Button
            size="lg"
            variant="outline"
            className="w-fit lg:w-full gap-2 text-primary-text rounded-md border-base-border bg-base-surface"
            disabled={isSubmitting}
          >
            <img src="./images/google-logo.svg" alt="Google Logo" />
            <span className="hidden lg:flex">Google</span>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="w-fit lg:w-full gap-2 bg-primary-text text-white rounded-md hover:bg-primary-text/90 hover:text-white"
            disabled={isSubmitting}
          >
            <img src="./images/apple-logo.svg" alt="Apple Logo" />
            <span className="hidden lg:flex">Apple</span>
          </Button>
        </div>
      </form>

      {/* Login Link */}
      <div className="text-center text-sm">
        <span className="text-gray-600">Already have an account? </span>
        <a href="#" className="text-primary-blue hover:underline font-medium">
          Login
        </a>
      </div>

      {/* NDPR Badge */}
      <div className="flex items-center justify-center gap-1.5 text-sm text-primary-text/70 rounded-md px-1.5 py-1 border border-base-border bg-[#F4F4F5] lg:bg-base-surface">
        <img src="./images/shield-star-fill.svg" alt="Shield Star Logo" />
        <span>NDPR Compliant</span>
      </div>

      {/* OTP Toast Notification */}
      <OTPToast
        otp={generatedOTP}
        show={showOTPToast}
        onClose={handleToastClose}
      />
    </div>
  );
}
