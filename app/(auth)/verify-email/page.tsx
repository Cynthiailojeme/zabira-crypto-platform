"use client";
import { OTPToast } from "@/app/components/dashboard/OTPToast";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { OtpInput } from "@/app/components/ui/input-otp";
import { changeEmailSchema, verificationSchema } from "@/app/utils/validations";
import { useFormik } from "formik";
import { AlertCircle, Mail, RefreshCw, ShieldCheck } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";

function VerifyOTP({
  email,
  onChangeEmail,
  setEmailVerified,
}: {
  email: string;
  onChangeEmail: () => void;
  setEmailVerified: (verified: boolean) => void;
}) {
  const [timeLeft, setTimeLeft] = useState(300);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [resendMessage, setResendMessage] = useState<string | null>(null);

  // OTP Toast state
  const [showOTPToast, setShowOTPToast] = useState(false);
  const [generatedOTP, setGeneratedOTP] = useState("");

  const formik = useFormik({
    initialValues: {
      otp: "",
    },
    validationSchema: verificationSchema,
    onSubmit: async (values) => {
      setIsVerifying(true);
      setApiError(null);

      try {
        const response = await fetch("/api/auth/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            otp: values.otp,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          setApiError(data.error || "Verification failed");
          return;
        }

        // Success! Store verified user data
        localStorage.setItem(
          "currentUser",
          JSON.stringify({
            email: data.user.email,
            id: data.user.id,
            verified: true,
          })
        );

        // Clear pending verification
        localStorage.removeItem("pendingVerification");

        setEmailVerified(true);
      } catch (error) {
        console.error("Verification error:", error);
        setApiError("Network error. Please check your connection.");
      } finally {
        setIsVerifying(false);
      }
    },
  });

  // Countdown
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) =>
    `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(
      seconds % 60
    ).padStart(2, "0")}`;

  const handlePasteCode = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (/^\d{6}$/.test(text)) {
        formik.setFieldValue("otp", text);
      }
    } catch (err) {
      console.error("Failed to read clipboard contents: ", err);
    }
  };

  const handleResendOTP = async () => {
    setIsResending(true);
    setResendMessage(null);
    setApiError(null);

    try {
      const response = await fetch(
        `/api/auth/verify?email=${encodeURIComponent(email)}`,
        {
          method: "GET",
        }
      );

      const data = await response.json();

      if (response.ok) {
        setResendMessage("New OTP sent!");
        setTimeLeft(300); // Reset timer

        // Show OTP in toast notification
        if (data.debug?.otp) {
          console.log("New OTP:", data.debug.otp);
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

        {/* Success Message Display */}
        {resendMessage && (
          <div className="p-3 rounded-lg bg-green-50 border border-green-200">
            <p className="text-sm text-green-600">{resendMessage}</p>
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

        <div className="flex justify-between items-center">
          <Button
            type="button"
            size="md"
            variant="outline"
            className="gap-2 text-primary-text rounded-md border-base-border bg-base-surface"
            onClick={onChangeEmail}
            disabled={isVerifying}
          >
            <RefreshCw className="w-5 h-5" />
            Change Email
          </Button>

          <button
            type="button"
            disabled={timeLeft > 0 || isResending}
            className="bg-transparent px-1.5 py-1 text-sm text-primary-text/70 font-medium rounded-sm disabled:opacity-50"
            onClick={handleResendOTP}
          >
            {isResending ? (
              "Resending..."
            ) : timeLeft > 0 ? (
              <>
                Resend Code in{" "}
                <span className="text-primary-blue">
                  {formatTime(timeLeft)}
                </span>
              </>
            ) : (
              "Resend Code"
            )}
          </button>
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

      {/* OTP Toast Notification for Resend */}
      <OTPToast
        otp={generatedOTP}
        email={email}
        show={showOTPToast}
        onClose={() => setShowOTPToast(false)}
      />
    </>
  );
}

function ChangeEmail({
  currentEmail,
  onSuccess,
}: {
  currentEmail: string;
  onSuccess: (email: string) => void;
}) {
  const [isChanging, setIsChanging] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // OTP Toast state
  const [showOTPToast, setShowOTPToast] = useState(false);
  const [generatedOTP, setGeneratedOTP] = useState("");
  const [newEmailForToast, setNewEmailForToast] = useState("");

  const formik = useFormik({
    initialValues: { email: "" },
    validationSchema: changeEmailSchema,
    onSubmit: async (values) => {
      setIsChanging(true);
      setApiError(null);

      try {
        const response = await fetch("/api/auth/verify", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            oldEmail: currentEmail,
            newEmail: values.email,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          setApiError(data.error || "Failed to change email");
          return;
        }

        // Show OTP in toast notification
        if (data.debug?.otp) {
          setGeneratedOTP(data.debug.otp);
          setNewEmailForToast(values.email);
          setShowOTPToast(true);

          // Auto-update email after 5 seconds or when toast closes
          setTimeout(() => {
            if (showOTPToast) {
              onSuccess(values.email);
            }
          }, 5000);
        } else {
          // If no debug OTP, just update email
          onSuccess(values.email);
        }
      } catch (error) {
        console.error("Change email error:", error);
        setApiError("Network error. Please try again.");
      } finally {
        setIsChanging(false);
      }
    },
  });

  const handleToastClose = () => {
    setShowOTPToast(false);
    onSuccess(newEmailForToast);
  };

  return (
    <>
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        {apiError && (
          <div className="p-3 flex items-center gap-2 rounded-lg bg-primary-alert/50 border border-primary-alert">
            <AlertCircle className="w-5 h-5 text-primary-alert" />
            <p className="text-sm font-medium text-primary-alert">{apiError}</p>
          </div>
        )}

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
          disabled={isChanging}
        />

        <Button
          size="lg"
          variant="outline"
          type="submit"
          disabled={!formik.isValid || !formik.dirty || isChanging}
          className="w-full gap-2 bg-primary-text text-white rounded-md hover:bg-primary-text/90 hover:text-white disabled:bg-[#F4F4F5] disabled:border-none disabled:text-primary-text/18"
        >
          {isChanging ? (
            <>
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Changing Email...</span>
            </>
          ) : (
            "Change Email"
          )}
        </Button>
      </form>

      {/* OTP Toast Notification */}
      <OTPToast
        otp={generatedOTP}
        email={newEmailForToast}
        show={showOTPToast}
        onClose={handleToastClose}
      />
    </>
  );
}

export function VerifyEmailContent() {
  const [isChangingEmail, setIsChangingEmail] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);

  // get email from query params
  const searchParams = useSearchParams();
  const rawEmail = searchParams.get("email") ?? "";
  const email = decodeURIComponent(rawEmail);

  const router = useRouter();

  // Load OTP from localStorage if available (for development)
  useEffect(() => {
    const pendingData = localStorage.getItem("pendingVerification");
    if (pendingData) {
      const data = JSON.parse(pendingData);
      if (data.debug?.otp) {
        console.log("Your OTP:", data.debug.otp);
      }
    }
  }, []);

  return (
    <div className="w-full max-w-full lg:max-w-125 flex flex-col items-center gap-6 mb-20">
      <div className="w-full flex flex-col gap-6 p-0 lg:p-9 bg-transparent lg:bg-white rounded-2xl shadow-custom">
        {emailVerified ? (
          <div className="flex flex-col items-center">
            <div>
              <img src="./images/check-circle.svg" alt="Check Circle" />
            </div>
            <h2 className="text-2xl font-bold text-primary-text mt-6 mb-2">
              Email Verified!
            </h2>
            <p className="text-primary-text text-base tracking-[-0.01rem]">
              Your email has been verified successfully.
            </p>

            <Button
              size="lg"
              variant="outline"
              type="button"
              onClick={() => {
                // route user to dashboard
                window.location.href = "/";
              }}
              className="w-full gap-2 bg-primary-text text-white rounded-md hover:bg-primary-text/90 hover:text-white mt-6 lg:mt-14"
            >
              Done
            </Button>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-primary-text">
              {isChangingEmail ? "Change email" : "Check your email"}
            </h2>

            {isChangingEmail ? (
              <p className="text-primary-text text-base tracking-[-0.01rem]">
                Enter the email address where you would like to receive the
                verification code
              </p>
            ) : (
              <p className="text-primary-text text-base tracking-[-0.01rem]">
                Hello Boss, please enter the 6 digit code that was sent to{" "}
                <span className="text-primary-blue">{email}</span>
              </p>
            )}

            {isChangingEmail ? (
              <ChangeEmail
                currentEmail={email}
                onSuccess={(newEmail) => {
                  const encodedEmail = encodeURIComponent(newEmail);
                  router.replace(`?email=${encodedEmail}`);
                  setIsChangingEmail(false);
                }}
              />
            ) : (
              <VerifyOTP
                email={email}
                onChangeEmail={() => setIsChangingEmail(true)}
                setEmailVerified={(verified) => setEmailVerified(verified)}
              />
            )}
          </>
        )}
      </div>

      {/* NDPR Badge */}
      {!emailVerified && (
        <div className="flex items-center justify-center gap-1.5 text-sm text-primary-text/70 rounded-md px-1.5 py-1 border border-base-border bg-[#F4F4F5] lg:bg-base-surface">
          <img src="./images/shield-star-fill.svg" alt="Shield Star Logo" />
          <span>NDPR Compliant</span>
        </div>
      )}
    </div>
  );
}

export default function VerifyEmail() {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-full lg:max-w-125 flex items-center justify-center">
          <div className="text-primary-text">Loading...</div>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
