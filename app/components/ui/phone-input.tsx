import React, { useEffect, useRef } from "react";
import PI from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { createRoot, Root } from "react-dom/client";

interface PhoneInputProps {
  /**
   * Label for phone input
   */
  label: string;
  /**
   * Value for phone input
   */
  value: string;
  /**
   * Change event for phone input. Emits E164Number or undefined
   */
  onChange: (value?: string | undefined) => void;
  /**
   * Prop to enforce international phone number format
   */
  international?: boolean;
  /**
   * Prop to edit the "country calling code" part of a phone number
   */
  countryCallingCodeEditable?: boolean;
  /**
   * Prop to render optional label
   */
  optional?: boolean;
  /**
   * Placeholder text
   */
  placeholder?: string;
  /**
   * Error message
   */
  error?: string | boolean;
  /**
   * Arbitrary props
   */
  [x: string]: any;
}

const ArrowDownIcon = () => {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mx-2"
    >
      <path
        d="M11.6844 5.55953L7.30939 9.93453C7.26876 9.97521 7.2205 10.0075 7.16739 10.0295C7.11428 10.0515 7.05735 10.0628 6.99986 10.0628C6.94236 10.0628 6.88543 10.0515 6.83232 10.0295C6.77921 10.0075 6.73096 9.97521 6.69032 9.93453L2.31532 5.55953C2.25407 5.49834 2.21235 5.42036 2.19544 5.33545C2.17853 5.25053 2.18719 5.16251 2.22033 5.08253C2.25348 5.00254 2.3096 4.93419 2.38161 4.88612C2.45362 4.83805 2.53828 4.81243 2.62486 4.8125H11.3749C11.4614 4.81243 11.5461 4.83805 11.6181 4.88612C11.6901 4.93419 11.7462 5.00254 11.7794 5.08253C11.8125 5.16251 11.8212 5.25053 11.8043 5.33545C11.7874 5.42036 11.7456 5.49834 11.6844 5.55953Z"
        fill="#747F9C"
      />
    </svg>
  );
};

/**
 * Phone input component for entering user phone number
 */
export const PhoneInput: React.FC<PhoneInputProps> = ({
  label,
  optional,
  error,
  international = true,
  countryCallingCodeEditable = false,
  placeholder = "Enter phone number",
  ...props
}) => {
  const arrowRootRef = useRef<Root | null>(null);

  useEffect(() => {
    const arrow = document.querySelector(
      ".PhoneInputCountrySelectArrow"
    ) as HTMLElement | null;

    if (!arrow) return;

    arrow.classList.replace("PhoneInputCountrySelectArrow", "phoneInputIcon");

    if (!arrowRootRef.current) {
      arrowRootRef.current = createRoot(arrow);
    }

    arrowRootRef.current.render(<ArrowDownIcon />);
  }, []);

  return (
    <div>
      <div
        className={`w-full border ${
          error ? "border-primary-alert" : "border-base-border"
        } rounded-lg p-4`}
      >
        {label && (
          <label className="block text-sm tracking-[-0.0105rem] font-semibold text-primary-text/70 mb-4">
            {label}
          </label>
        )}

        <div className="relative group">
          <PI
            placeholder={placeholder}
            countrySelectProps={{ unicodeFlags: false }}
            defaultCountry="NG"
            international={international}
            withCountryCallingCode
            countryCallingCodeEditable={countryCallingCodeEditable}
            smartCaret={false}
            {...props}
          />
        </div>
      </div>
      {error && <p className="mt-1.5 text-sm text-primary-alert">{error}</p>}
    </div>
  );
};
