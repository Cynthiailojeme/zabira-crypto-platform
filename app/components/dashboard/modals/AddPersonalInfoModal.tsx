"use client";

import { useEffect, useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalBody,
} from "../../ui/modal";
import { Input } from "../../ui/input";
import {
  AlertCircle,
  Calendar,
  ChevronDown,
  ShieldCheck,
  User,
} from "lucide-react";
import { useFormik } from "formik";
import { personalInfoSchema } from "@/app/utils/validations";
import { cn } from "../../ui/utils";
import { Button } from "../../ui/button";
import { getCurrentUser } from "@/app/utils/auth";

const CustomUserIcon: React.FC<React.SVGProps<SVGSVGElement>> = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
  >
    <ellipse
      cx="12"
      cy="17.5"
      rx="7"
      ry="3.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <circle
      cx="12"
      cy="7"
      r="4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
);

interface AddPersonalInfoProps {
  open: boolean;
  setOpen: (val: string) => void;
  handleCompletion: () => void;
}

export function AddPersonalInfoModal({
  open,
  setOpen,
  handleCompletion,
}: AddPersonalInfoProps) {
  const [reqMet, setReqMet] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      username: "",
      firstname: "",
      lastname: "",
      dob: "",
    },
    validationSchema: personalInfoSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      setApiError(null);

      try {
        const user = getCurrentUser();
        if (!user) {
          setApiError("User not found");
          return;
        }

        const response = await fetch("/api/profile/personal-info", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: user.email,
            username: values.username,
            firstname: values.firstname,
            lastname: values.lastname,
            dob: values.dob || undefined,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          setApiError(data.error || "Failed to save personal information");
          return;
        }

        // Success!
        handleCompletion();
      } catch (error) {
        console.error("Personal info error:", error);
        setApiError("Network error. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  /* Username requirement: must contain letter + number */
  useEffect(() => {
    const hasLetter = /[a-zA-Z]/.test(formik.values.username);
    const hasNumber = /\d/.test(formik.values.username);
    setReqMet(hasLetter && hasNumber);
  }, [formik.values.username]);

  return (
    <Modal open={open}>
      <ModalHeader onClose={() => setOpen("")}>
        <ModalTitle>Add personal information</ModalTitle>
        <ModalDescription>
          Add your personal information to begin transacting.
        </ModalDescription>
      </ModalHeader>

      <ModalBody>
        <div className="space-y-4">
          <form
            onSubmit={formik.handleSubmit}
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

            {/* Username */}
            <div className="flex flex-col gap-3">
              <Input
                label="Username"
                type="text"
                placeholder="Enter username"
                icon={CustomUserIcon}
                {...formik.getFieldProps("username")}
                error={
                  formik.touched.username && formik.errors.username
                    ? formik.errors.username
                    : undefined
                }
                disabled={isSubmitting}
              />

              <div className="flex items-center gap-2 text-sm text-primary-text/36">
                <div
                  className={cn(
                    "shrink-0 w-4 h-4 rounded-full flex items-center justify-center",
                    reqMet ? "bg-primary-green" : "bg-[#C7CDD1]"
                  )}
                >
                  <svg
                    className="w-3 h-3 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                Username must contain a letter and a number
              </div>
            </div>

            {/* Firstname */}
            <Input
              label="Firstname"
              type="text"
              placeholder="Enter firstname"
              icon={CustomUserIcon}
              {...formik.getFieldProps("firstname")}
              error={
                formik.touched.firstname && formik.errors.firstname
                  ? formik.errors.firstname
                  : undefined
              }
              disabled={isSubmitting}
            />

            {/* Lastname */}
            <Input
              label="Lastname"
              type="text"
              placeholder="Enter lastname"
              icon={CustomUserIcon}
              {...formik.getFieldProps("lastname")}
              error={
                formik.touched.lastname && formik.errors.lastname
                  ? formik.errors.lastname
                  : undefined
              }
              disabled={isSubmitting}
            />

            {/* Date of Birth */}
            <Input
              label="Date of Birth (Optional)"
              type="date"
              icon={Calendar}
              rightIcon={ChevronDown}
              placeholder="Choose date of birth"
              max={
                new Date(new Date().setFullYear(new Date().getFullYear() - 18))
                  .toISOString()
                  .split("T")[0]
              }
              value={formik.values.dob}
              onChange={formik.handleChange}
              name="dob"
              error={
                formik.touched.dob && formik.errors.dob
                  ? formik.errors.dob
                  : undefined
              }
              disabled={isSubmitting}
            />

            <Button
              size="lg"
              type="submit"
              variant="outline"
              disabled={!formik.isValid || !formik.dirty || isSubmitting}
              className="w-full gap-2 bg-primary-text text-white rounded-md hover:bg-primary-text/90 hover:text-white disabled:bg-[#F4F4F5] disabled:border-none disabled:text-primary-text/18"
            >
              <ShieldCheck className="w-6 h-6" />
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </form>
        </div>
      </ModalBody>
    </Modal>
  );
}
