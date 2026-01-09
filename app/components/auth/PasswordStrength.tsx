import * as React from "react";
import { cn } from "../ui/utils";

export const PasswordStrengthIndicator: React.FC<{ password: string }> = ({
  password,
}) => {
  const rules = [
    password.length >= 8,
    /[a-z]/.test(password) && /[A-Z]/.test(password),
    /\d/.test(password),
    /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  ];

  const score = rules.filter(Boolean).length;

  let label = "";
  let activeBars = 0;
  let color = "#e92f15";

  if (score === 1) {
    label = "Weak";
    activeBars = 1;
    color = "#e92f15";
  } else if (score === 2) {
    label = "Average";
    activeBars = 2;
    color = "#e7b008";
  } else if (score === 3) {
    label = "Good";
    activeBars = 3;
    color = "#16A249";
  } else if (score === 4) {
    label = "Strong";
    activeBars = 4;
    color = "#16A249";
  }

  if (!label) return null;

  return (
    <div className="mt-3 space-y-1">
      <div className="flex items-center gap-4 bg-[#F9F9FB] px-2 py-1 rounded-lg">
        <span className="text-base font-normal text-primary-text/70">
          {label}
        </span>

        <div className="flex gap-3 flex-1">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-2 flex-1 rounded-full"
              style={{
                backgroundColor: i <= activeBars ? color : "#E5E5E5",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};


// Validation requirements component
export const ValidationRequirements: React.FC<{ password: string }> = ({
  password,
}) => {
  const requirements = [
    {
      label: "Must be at least 8 characters.",
      met: password.length >= 8,
    },
    {
      label: "Capital letters and lower case, e.g. A and a",
      met: /[a-z]/.test(password) && /[A-Z]/.test(password),
    },
    {
      label: "Numbers, e.g. 1234567890",
      met: /\d/.test(password),
    },
    {
      label: "Special characters, e.g. !@#$%^&*()_+",
      met: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    },
  ];

  return (
    <div className="space-y-2 mt-3">
      {requirements.map((req, index) => (
        <div key={index} className="flex items-start gap-2">
          <div
            className={cn(
              "shrink-0 w-4 h-4 rounded-full flex items-center justify-center mt-0.5",
              req.met ? "bg-primary-green" : "bg-primary-alert"
            )}
          >
            {req.met ? (
              <svg
                className="w-3 h-3 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <svg
                className="w-3 h-3 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            )}
          </div>
          <span
            className={cn(
              "text-sm",
              req.met ? "text-[#819099]" : "text-primary-alert"
            )}
          >
            {req.label}
          </span>
        </div>
      ))}
    </div>
  );
};
