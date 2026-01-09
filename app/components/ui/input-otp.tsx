import React, { useMemo } from "react";

export interface OtpInputProps
  extends React.AllHTMLAttributes<HTMLInputElement> {
  /**
   * Label for otp input element
   */
  label: string;
  /**
   * Holds the value of the otp code entered
   */
  value: string;
  /**
   * Error message
   */
  error?: string | boolean;
  /**
   * Other unknown attributes
   */
  [x: string]: unknown;
}

/**
 * Otp Input component
 */
export const OtpInput: React.FC<OtpInputProps> = (props) => {
  const digitCount = 6;
  const RE_DIGIT = new RegExp(/^\d+$/);

  const valueItems = useMemo(() => {
    const valueArray = props?.value?.split("");
    const items = [];

    for (let i = 0; i < digitCount; i++) {
      const char = valueArray[i];
      if (RE_DIGIT.test(char)) {
        items.push(char);
      } else {
        items.push("");
      }
    }
    return items;
  }, [props.value, RE_DIGIT]);

  const focusToNextInput = (target: HTMLElement) => {
    const nextElementSibling = target.nextElementSibling;

    if (nextElementSibling && nextElementSibling.matches("input")) {
      (nextElementSibling as HTMLInputElement).focus();
    } else {
      const next = nextElementSibling?.nextElementSibling;
      (next as HTMLInputElement)?.focus();
    }
  };

  const focusToPrevInput = (target: HTMLElement) => {
    const previousElementSibling = target.previousElementSibling;

    if (previousElementSibling && previousElementSibling.matches("input")) {
      (previousElementSibling as HTMLInputElement).focus();
    } else {
      const prev = previousElementSibling?.previousElementSibling;
      (prev as HTMLInputElement)?.focus();
    }
  };

  const inputOnChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const target = e.target;
    let targetValue = target.value?.replace(/\D/g, "");
    const isTargetValueDigit = RE_DIGIT.test(targetValue);

    if (!isTargetValueDigit && targetValue !== "") {
      return;
    }

    targetValue = isTargetValueDigit ? targetValue : "";

    const newValue: any =
      props.value.substring(0, index) +
      targetValue +
      props.value.substring(index + 1);

    props.onChange?.(newValue);

    if (targetValue.trim().length === 1) {
      focusToNextInput(target);
    }

    // focus on the next input box
    const nextElementSibling = target.nextElementSibling as HTMLInputElement;

    if (nextElementSibling && !!targetValue.trim()) {
      nextElementSibling.focus();
    }
  };

  const inputOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const { key } = e;
    const target = e.target as HTMLInputElement;

    if (key === "ArrowRight" || key === "ArrowDown") {
      e.preventDefault();
      return focusToNextInput(target);
    }

    if (key === "ArrowLeft" || key === "ArrowUp") {
      e.preventDefault();
      return focusToPrevInput(target);
    }

    const targetValue = target.value;

    target.setSelectionRange(0, targetValue.length);

    if (e.key !== "Backspace" || targetValue !== "") {
      return;
    }

    focusToPrevInput(target);
  };

  const inputOnFocus = (e: React.FocusEvent<HTMLInputElement, Element>) => {
    const { target } = e;

    const prevInputEl = target.previousElementSibling as HTMLInputElement;

    if (
      prevInputEl &&
      prevInputEl.value === "" &&
      prevInputEl.matches("input")
    ) {
      return prevInputEl.focus();
    }

    target.setSelectionRange(0, target.value.length);
  };
  return (
    <div className="grid gap-2 content-start">
      <label className="cc-input--label">{props.label}</label>
      <div className="flex items-center justify-between w-full gap-3">
        {valueItems.map((item, i) => (
          <React.Fragment key={i.toString()}>
            <input
              {...props}
              className="rounded-lg w-12.5 h-11.5 text-center py-3 px-2.5 border border-[#D8D8D8] bg-white focus:border-[#D8D8D8] text-neutral-base focus:outline-none focus:ring-[#D8D8D8]/24 disabled:bg-neutral-3 disabled:border-[#D8D8D8] disabled:text-neutral-30 text-primary-text transition-all duration-300 ease-out"
              type="text"
              autoFocus={i === props.value.length}
              inputMode="numeric"
              value={item.trim()}
              onChange={(e) => inputOnChange(e, i)}
              onKeyDown={(e) => inputOnKeyDown(e)}
              onFocus={(e) => inputOnFocus(e)}
            />
          </React.Fragment>
        ))}
      </div>
      {props?.error && (
        <span className="mt-1.5 text-sm text-primary-alert">
          {props?.error}
        </span>
      )}
    </div>
  );
};
