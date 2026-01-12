"use client";

import { useState, useEffect } from "react";
import { useFormik } from "formik";
import {
  phoneVerificationSchema,
  verificationSchema,
} from "@/app/utils/validations";
import {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalBody,
} from "../../ui/modal";
import { OtpInput } from "../../ui/input-otp";
import { Button } from "../../ui/button";
import { AlertCircle, ArrowLeft, RefreshCw, ShieldCheck } from "lucide-react";
import { PhoneInput } from "../../ui/phone-input";
import MessageSwitcher from "../MessageSwitcher";
import { getCurrentUser } from "@/app/utils/auth";
import { OTPToast } from "../OTPToast";

type Option = "whatsapp" | "sms" | "";

function VerifyOTP({
  onChangePhoneNo,
  handleCompletion,
}: {
  onChangePhoneNo: () => void;
  handleCompletion: () => void;
}) {
  const [timeLeft, setTimeLeft] = useState(300);
  const [active, setActive] = useState<Option>("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // OTP Toast state
  const [showOTPToast, setShowOTPToast] = useState(false);
  const [generatedOTP, setGeneratedOTP] = useState("");

  const formik = useFormik({
    initialValues: { otp: "" },
    validationSchema: verificationSchema,
    onSubmit: async (values) => {
      setIsVerifying(true);
      setApiError(null);

      try {
        const user = getCurrentUser();
        if (!user) {
          setApiError("User not found");
          return;
        }

        const response = await fetch("/api/profile/phone", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: user.email,
            otp: values.otp,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          setApiError(data.error || "Verification failed");
          return;
        }

        // Success!
        handleCompletion();
      } catch (error) {
        console.error("Verification error:", error);
        setApiError("Network error. Please try again.");
      } finally {
        setIsVerifying(false);
      }
    },
  });

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) =>
    `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(
      seconds % 60
    ).padStart(2, "0")}`;

  const handlePasteCode = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (/^\d{6}$/.test(text)) formik.setFieldValue("otp", text);
    } catch (err) {
      console.error("Failed to read clipboard contents: ", err);
    }
  };

  const handleResendOTP = async () => {
    formik.setFieldValue("otp", "");
    setIsResending(true);
    setApiError(null);

    try {
      const user = getCurrentUser();
      if (!user) {
        setApiError("User not found");
        return;
      }

      const response = await fetch(
        `/api/profile/phone?email=${encodeURIComponent(
          user.email
        )}&method=${active}`,
        {
          method: "GET",
        }
      );

      const data = await response.json();

      if (response.ok) {
        setTimeLeft(300); // Reset timer

        // Show OTP in toast
        if (data.debug?.otp) {
          setGeneratedOTP(data.debug.otp);
          setShowOTPToast(true);
        }
      } else {
        setApiError(data.error || "Failed to resend OTP");
      }
    } catch (error) {
      setApiError("Network error. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <>
      <form onSubmit={formik.handleSubmit} className="space-y-8">
        {/* API Error Display */}
        {apiError && (
          <div className="p-3 flex items-center gap-2 rounded-lg bg-primary-alert/50 border border-primary-alert">
            <AlertCircle className="w-5 h-5 text-primary-alert" />
            <p className="text-sm font-medium text-primary-alert">{apiError}</p>
          </div>
        )}

        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm font-semibold text-primary-text">
              Enter Code
            </span>
            <button
              type="button"
              onClick={handlePasteCode}
              className="bg-[#F4F4F5] px-1.5 py-1 text-xs text-primary-text font-medium rounded-sm"
            >
              Paste Code
            </button>
          </div>

          <OtpInput
            label=""
            value={formik.values.otp}
            onChange={(value) => formik.setFieldValue("otp", value)}
            error={
              formik.touched.otp && formik.errors.otp
                ? formik.errors.otp
                : undefined
            }
          />
        </div>

        <div className="space-y-4">
          {timeLeft === 0 && (
            <div className="flex items-center gap-3 text-primary-text/70 font-medium text-sm tracking-[-0.0105rem]">
              <span>Resend Via</span>
              <MessageSwitcher
                active={active}
                setActive={setActive}
                buttonTwoText="SMS"
              />
            </div>
          )}

          <div className="flex justify-between items-center">
            <Button
              type="button"
              size="md"
              variant="outline"
              className="px-3 py-2 gap-2 text-primary-text rounded-md border-base-border bg-base-surface"
              onClick={onChangePhoneNo}
              disabled={isVerifying}
            >
              <RefreshCw className="w-5 h-5" />
              Change Phone Number
            </Button>

            {timeLeft > 0 ? (
              <button
                type="button"
                disabled
                className="bg-transparent px-1.5 py-1 text-sm text-primary-text/70 font-medium rounded-sm disabled:cursor-default"
              >
                Resend Code in{" "}
                <span className="text-primary-blue">
                  {formatTime(timeLeft)}
                </span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={isResending}
                className="bg-transparent px-1.5 py-1 text-sm text-primary-blue font-medium rounded-sm disabled:opacity-50"
              >
                {isResending ? "Resending..." : "Resend Code"}
              </button>
            )}
          </div>
        </div>

        <Button
          size="lg"
          type="submit"
          variant="outline"
          disabled={!formik.isValid || !formik.dirty || isVerifying}
          className="w-full gap-2 bg-primary-text text-white rounded-md hover:bg-primary-text/90 hover:text-white disabled:bg-[#F4F4F5] disabled:border-none disabled:text-primary-text/18"
        >
          {isVerifying ? (
            <>
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Verifying...</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-6 h-6" />
              Verify
            </>
          )}
        </Button>
      </form>

      {/* OTP Toast */}
      <OTPToast
        otp={generatedOTP}
        show={showOTPToast}
        onClose={() => setShowOTPToast(false)}
      />
    </>
  );
}

interface VerifyPhoneNumberProps {
  open: boolean;
  setOpen: (val: string) => void;
  handleCompletion: () => void;
}

export function VerifyPhoneNumberModal({
  open,
  setOpen,
  handleCompletion,
}: VerifyPhoneNumberProps) {
  const [active, setActive] = useState<Option>("whatsapp");
  const [step, setStep] = useState<
    "verify-phone-view" | "verify-code-view" | "change-phone-view"
  >("verify-phone-view");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // OTP Toast state
  const [showOTPToast, setShowOTPToast] = useState(false);
  const [generatedOTP, setGeneratedOTP] = useState("");

  const formik = useFormik({
    initialValues: { phonenumber: "" },
    validationSchema: phoneVerificationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      setApiError(null);

      try {
        const user = getCurrentUser();
        if (!user) {
          setApiError("User not found");
          return;
        }

        const response = await fetch("/api/profile/phone", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: user.email,
            phoneNumber: values.phonenumber,
            method: active,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          setApiError(data.error || "Failed to send OTP");
          return;
        }

        // Show OTP in toast
        if (data.debug?.otp) {
          setGeneratedOTP(data.debug.otp);
          setShowOTPToast(true);
        }

        // Move to OTP verification step
        setStep("verify-code-view");
      } catch (error) {
        console.error("Phone verification error:", error);
        setApiError("Network error. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handlePhoneChangeSubmit = async () => {
    const errors = await formik.validateForm();
    if (errors.phonenumber) {
      formik.setFieldTouched("phonenumber", true);
      return;
    }

    setIsSubmitting(true);
    setApiError(null);

    try {
      const user = getCurrentUser();
      if (!user) {
        setApiError("User not found");
        return;
      }

      const response = await fetch("/api/profile/phone", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          phoneNumber: formik.values.phonenumber,
          method: active,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setApiError(data.error || "Failed to send OTP");
        return;
      }

      // Show OTP in toast
      if (data.debug?.otp) {
        setGeneratedOTP(data.debug.otp);
        setShowOTPToast(true);
      }

      // Move to OTP verification step
      setStep("verify-code-view");
    } catch (error) {
      console.error("Phone verification error:", error);
      setApiError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal open={open}>
      <ModalHeader onClose={() => setOpen("")}>
        {step === "change-phone-view" && (
          <button
            type="button"
            onClick={() => setStep("verify-code-view")}
            className="mb-4 flex h-9 py-2 pl-2 pr-4 text-sm font-semibold tracking-[-0.0105rem] items-center gap-1 rounded-[2.5rem] border border-[rgba(26,26,26,0.12)] bg-[#F4F4F5]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        )}

        <ModalTitle>
          {step === "change-phone-view"
            ? "Change phone number"
            : step === "verify-code-view"
            ? "Enter verification code"
            : "Verify phone number"}
        </ModalTitle>

        <ModalDescription>
          {step === "change-phone-view" &&
            "Please enter a phone number where you would like to receive the verification code"}
          {step === "verify-code-view" && (
            <div>
              Hello Boss, please enter the 6 digit code that was sent to{" "}
              <span className="text-primary-blue font-medium">
                {formik.values.phonenumber || "your phone number"}
              </span>
            </div>
          )}
          {step === "verify-phone-view" &&
            "Please enter a phone number where you would like to receive the verification code"}
        </ModalDescription>
      </ModalHeader>

      <ModalBody>
        <div className="space-y-4">
          {step !== "verify-code-view" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (step === "verify-phone-view") formik.handleSubmit();
                else handlePhoneChangeSubmit();
              }}
              className="w-full flex flex-col gap-4"
            >
              {/* API Error Display */}
              {apiError && (
                <div className="p-3 flex items-center gap-2 rounded-lg bg-primary-alert/50 border border-primary-alert">
                  <AlertCircle className="w-5 h-5 text-primary-alert" />
                  <p className="text-sm font-medium text-primary-alert">
                    {apiError}
                  </p>
                </div>
              )}

              <div className="mt-2 mb-4">
                <MessageSwitcher active={active} setActive={setActive} />
              </div>

              <PhoneInput
                label="Phone Number"
                placeholder=""
                {...formik.getFieldProps("phonenumber")}
                value={formik.values.phonenumber}
                onChange={(value) => formik.setFieldValue("phonenumber", value)}
                error={formik.touched.phonenumber && formik.errors.phonenumber}
                disabled={isSubmitting}
              />

              <Button
                size="lg"
                type="submit"
                variant="outline"
                disabled={isSubmitting}
                className="w-full gap-2 bg-primary-text text-white rounded-md hover:bg-primary-text/90 hover:text-white disabled:bg-[#F4F4F5] disabled:border-none disabled:text-primary-text/18"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Sending OTP...</span>
                  </>
                ) : (
                  <>
                    {step !== "change-phone-view" && (
                      <ShieldCheck className="w-6 h-6" />
                    )}
                    {step === "change-phone-view"
                      ? "Change Phone Number"
                      : "Verify"}
                  </>
                )}
              </Button>
            </form>
          )}

          {step === "verify-code-view" && (
            <VerifyOTP
              onChangePhoneNo={() => setStep("change-phone-view")}
              handleCompletion={handleCompletion}
            />
          )}
        </div>
      </ModalBody>

      <OTPToast
        otp={generatedOTP}
        show={showOTPToast}
        onClose={() => setShowOTPToast(false)}
      />
    </Modal>
  );
}
