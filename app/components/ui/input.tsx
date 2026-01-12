import * as React from "react";
import { cn } from "./utils";

interface InputProps extends React.ComponentProps<"input"> {
  label?: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  rightIcon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  onRightIconClick?: () => void;
  error?: string;
  helperText?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      label,
      icon: Icon,
      rightIcon: RightIcon,
      onRightIconClick,
      error,
      helperText,
      ...props
    },
    ref
  ) => {
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
            {Icon && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none text-[#819099] transition-colors group-focus-within:text-[#0044EE]">
                <Icon className="h-6 w-6" />
              </div>
            )}

            <input
              ref={ref}
              type={type}
              data-slot="input"
              className={cn(
                "w-full flex border-none bg-transparent focus:outline-none text-primary-text placeholder:text-primary-text/36 disabled:bg-neutral-5 transition-all duration-300 ease-out",
                Icon && "pl-8",
                RightIcon && "pr-8",
                className
              )}
              aria-invalid={!!error}
              {...props}
            />

            {RightIcon && (
              <button
                type="button"
                onClick={onRightIconClick}
                className="absolute right-0 top-1/2 -translate-y-1/2 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
                tabIndex={-1}
              >
                <RightIcon className="h-6 w-6 text-[#819099]" />
              </button>
            )}
          </div>
        </div>
        {(error || helperText) && (
          <p
            className={cn(
              "mt-1.5 text-sm",
              error ? "text-primary-alert" : "text-primary-text/36"
            )}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
export type { InputProps };
