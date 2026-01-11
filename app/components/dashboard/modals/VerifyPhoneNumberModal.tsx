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
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { OtpInput } from "../../ui/input-otp";
import { Button } from "../../ui/button";
import { ArrowLeft, RefreshCw, ShieldCheck } from "lucide-react";
import { PhoneInput } from "../../ui/phone-input";
import MessageSwitcher from "../MessageSwitcher";

function VerifyOTP({
  phoneNo,
  onChangePhoneNo,
  handleCompletion,
}: {
  phoneNo: string;
  onChangePhoneNo: () => void;
  handleCompletion: () => void;
}) {
  const [timeLeft, setTimeLeft] = useState(300);
  const [active, setActive] = useState<Option>("");

  const formik = useFormik({
    initialValues: {
      otp: "",
    },
    validationSchema: verificationSchema,
    onSubmit: (values) => {
      console.log("Verifying OTP:", { phoneNo, ...values });
      handleCompletion();
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

      <div className="space-y-4">
        {timeLeft === 0 && (
          <div className="flex items-center gap-3 text-primary-text/70 font-medium text-sm tracking-[-0.0105rem]">
            <span>Resend Via</span>{" "}
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
          >
            <RefreshCw className="w-5 h-5" />
            Change Phone Number
          </Button>

          {timeLeft > 0 && (
            <button
              type="button"
              disabled={timeLeft > 0}
              className="bg-transparent px-1.5 py-1 text-sm text-primary-text/70 font-medium rounded-sm"
              onClick={() => setTimeLeft(300)}
            >
              <>
                Resend Code in{" "}
                <span className="text-primary-blue">
                  {formatTime(timeLeft)}
                </span>
              </>
            </button>
          )}
        </div>
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

interface VerifyPhoneNumberProps {
  open: boolean;
  setOpen: (val: string) => void;
  handleCompletion: () => void;
}

type Option = "whatsapp" | "sms" | "";

export function VerifyPhoneNumberModal({
  open,
  setOpen,
  handleCompletion,
}: VerifyPhoneNumberProps) {
  const [active, setActive] = useState<Option>("whatsapp");

  const [step, setStep] = useState("verify-phone-view");
  const formik = useFormik({
    initialValues: {
      phonenumber: "",
    },
    validationSchema: phoneVerificationSchema,
    onSubmit: (values) => {
      setStep("verify-code-view");
    },
  });

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
          {step === "change-phone-view" ? (
            "Please enter a phone number where you would like to receive the verification code"
          ) : step === "verify-code-view" ? (
            <div>
              Hello Boss, please enter the 6 digit code that was sent to{" "}
              <span className="text-primary-blue font-medium">08012345678</span>
            </div>
          ) : (
            "Please enter a phone number where you would like to receive the verification code"
          )}
        </ModalDescription>
      </ModalHeader>

      <ModalBody>
        <div className="space-y-4">
          {step === "verify-phone-view" && (
            <form
              onSubmit={formik.handleSubmit}
              className="w-full flex flex-col gap-4"
            >
              <div className="mt-2 mb-4">
                <MessageSwitcher active={active} setActive={setActive} />
              </div>

              <PhoneInput
                label="Phone Number"
                placeholder=""
                {...formik.getFieldProps("phonenumber")}
                value={formik.values.phonenumber}
                onChange={(value) => {
                  formik.setFieldValue("phonenumber", value);
                }}
                error={formik.touched.phonenumber && formik.errors.phonenumber}
              />

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
          )}

          {step === "verify-code-view" && (
            <VerifyOTP
              phoneNo={formik.values.phonenumber}
              onChangePhoneNo={() => setStep("change-phone-view")}
              handleCompletion={handleCompletion}
            />
          )}

          {step === "change-phone-view" && (
            <div className="space-y-6">
              <PhoneInput
                label="Phone Number"
                placeholder=""
                {...formik.getFieldProps("phonenumber")}
                value={formik.values.phonenumber}
                onChange={(value) => {
                  formik.setFieldValue("phonenumber", value);
                }}
                error={formik.touched.phonenumber && formik.errors.phonenumber}
              />

              <Button
                size="lg"
                type="submit"
                variant="outline"
                className="w-full gap-2 bg-primary-text text-white rounded-md hover:bg-primary-text/90 hover:text-white"
              >
                Change Phone Number
              </Button>
            </div>
          )}
        </div>
      </ModalBody>
    </Modal>
  );
}
