"use client";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { OtpInput } from "@/app/components/ui/input-otp";
import { changeEmailSchema, verificationSchema } from "@/app/utils/validations";
import { useFormik } from "formik";
import { Mail, RefreshCw, ShieldCheck } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

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

  const formik = useFormik({
    initialValues: {
      otp: "",
    },
    validationSchema: verificationSchema,
    onSubmit: (values) => {
      console.log("Verifying OTP:", { email, ...values });
      setEmailVerified(true);
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
      // silently fail
      console.error("Failed to read clipboard contents: ", err);
    }
  };

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-8">
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
        >
          <RefreshCw className="w-5 h-5" />
          Change Email
        </Button>

        <button
          type="button"
          disabled={timeLeft > 0}
          className="bg-transparent px-1.5 py-1 text-sm text-primary-text/70 font-medium rounded-sm"
          onClick={() => setTimeLeft(300)}
        >
          {timeLeft > 0 ? (
            <>
              Resend Code in{" "}
              <span className="text-primary-blue">{formatTime(timeLeft)}</span>
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
        className="w-full gap-2 bg-primary-text text-white rounded-md hover:bg-primary-text/90 hover:text-white"
      >
        <ShieldCheck className="w-6 h-6" />
        Verify
      </Button>
    </form>
  );
}

function ChangeEmail({ onSuccess }: { onSuccess: (email: string) => void }) {
  const formik = useFormik({
    initialValues: { email: "" },
    validationSchema: changeEmailSchema,
    onSubmit: (values) => {
      onSuccess(values.email);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
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
      />

      <Button
        size="lg"
        variant="outline"
        type="submit"
        className="w-full gap-2 bg-primary-text text-white rounded-md hover:bg-primary-text/90 hover:text-white"
      >
        Change Email
      </Button>
    </form>
  );
}

export default function VerifyEmail() {
  const [isChangingEmail, setIsChangingEmail] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);

  // get email from query params
  const searchParams = useSearchParams();
  const rawEmail = searchParams.get("email") ?? "";
  const email = decodeURIComponent(rawEmail);

  const router = useRouter();

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
