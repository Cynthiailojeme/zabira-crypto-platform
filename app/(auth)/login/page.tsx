"use client";

import { useState, useEffect } from "react";
import {
  Eye,
  EyeOff,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { useFormik } from "formik";
import { loginSchema } from "@/app/utils/validations";
import { promoSlides } from "../signup/page";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LockIcon, MailIcon } from "@/app/utils/icons";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const router = useRouter();

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
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      setApiError(null);

      try {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: values.email,
            password: values.password,
          }),
        });

        // Check if response is JSON before parsing
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          console.error("Non-JSON response received:", response.status);
          setApiError("Server error. Please check if the API route exists.");
          return;
        }

        const data = await response.json();

        if (!response.ok) {
          // Handle email verification requirement
          if (data.requiresVerification) {
            setApiError(data.error);
            // Optionally redirect to verification page
            setTimeout(() => {
              router.push(`/verify-email?email=${encodeURIComponent(data.email)}`);
            }, 2000);
            return;
          }

          setApiError(data.error || "Login failed. Please try again.");
          return;
        }

        // Store user data in localStorage or context
        if (typeof window !== "undefined") {
          const loggedUser = JSON.stringify(data.user);
          localStorage.setItem("currentUser", loggedUser);
        }

        // Redirect to dashboard or home page
        router.push("/");
      } catch (error) {
        console.error("Login error:", error);
        setApiError("An unexpected error occurred. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <div className="w-full max-w-full lg:max-w-125 flex flex-col items-center gap-6 mb-20">
      <form
        onSubmit={formik.handleSubmit}
        className="w-full flex flex-col gap-6 p-0 lg:p-9 bg-transparent lg:bg-white rounded-2xl shadow-custom"
      >
        {/* Title */}
        <h2 className="text-2xl font-bold text-primary-text">Welcome back!</h2>

        {/* API Error Display */}
        {apiError && (
          <div className="p-3 flex items-center gap-2 rounded-lg bg-primary-alert/10 border border-primary-alert">
            <AlertCircle className="w-5 h-5 text-primary-alert" />
            <p className="text-sm font-medium text-primary-alert">{apiError}</p>
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
            icon={MailIcon}
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
              icon={LockIcon}
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
          </div>
        </div>

        {/* Login Button */}
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
                Logging in...
              </span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-6 h-6" />
              <span className="flex font-semibold text-base">Login</span>
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

      {/* Signup Link */}
      <div className="text-center text-sm">
        <span className="text-gray-600">Don't have an account? </span>

        <Link
          href="/signup"
          className="text-primary-blue hover:underline font-medium"
        >
          Signup
        </Link>
      </div>

      {/* NDPR Badge */}
      <div className="flex items-center justify-center gap-1.5 text-sm text-primary-text/70 rounded-md px-1.5 py-1 border border-base-border bg-[#F4F4F5] lg:bg-base-surface">
        <img src="./images/shield-star-fill.svg" alt="Shield Star Logo" />
        <span>NDPR Compliant</span>
      </div>
    </div>
  );
}
