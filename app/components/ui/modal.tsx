"use client";

import * as React from "react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import { cn } from "./utils";

// ============================================================================
// BASE MODAL COMPONENTS
// ============================================================================

interface ModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

function Modal({ open, onOpenChange, children, className }: ModalProps) {
  return (
    <AlertDialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialogPrimitive.Portal>
        <AlertDialogPrimitive.Overlay
          className={cn(
            "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "duration-200"
          )}
        />
        <AlertDialogPrimitive.Title></AlertDialogPrimitive.Title>
        <AlertDialogPrimitive.Content
          className={cn(
            "fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%]",
            "w-[calc(100%-2rem)] max-w-md",
            "bg-white rounded-2xl shadow-2xl",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "data-[state=closed]:slide-out-to-top-[2%] data-[state=open]:slide-in-from-top-[2%]",
            "duration-200",
            className
          )}
        >
          {children}
        </AlertDialogPrimitive.Content>
      </AlertDialogPrimitive.Portal>
    </AlertDialogPrimitive.Root>
  );
}

// ============================================================================
// MODAL HEADER
// ============================================================================

interface ModalHeaderProps {
  children: React.ReactNode;
  className?: string;
  onClose?: () => void;
  showClose?: boolean;
  rightElement?: React.ReactNode;
}

function ModalHeader({
  children,
  className,
  onClose,
  showClose = true,
  rightElement,
}: ModalHeaderProps) {
  return (
    <div className={cn("relative px-6 pt-6 pb-4", className)}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">{children}</div>
        {rightElement && <div className="ml-9 shrink-0">{rightElement}</div>}
      </div>

      {showClose && (
        <AlertDialogPrimitive.Cancel
          onClick={onClose}
          className={cn(
            "absolute right-0 -top-10 h-8 w-8 rounded-full flex items-center justify-center bg-white p-2",
            "text-gray-400 hover:text-gray-600 hover:bg-gray-100",
            "transition-colors focus:outline-none focus-visible:ring-2",
            "focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          )}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
          >
            <path
              d="M0.500052 8.98528L8.98533 0.5M8.98528 8.98528L0.5 0.5"
              stroke="#0A1820"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="sr-only">Close</span>
        </AlertDialogPrimitive.Cancel>
      )}
    </div>
  );
}

interface ModalTitleProps {
  children: React.ReactNode;
  className?: string;
}

function ModalTitle({ children, className }: ModalTitleProps) {
  return (
    <h2
      className={cn(
        "text-xl font-bold text-primary-text mb-1 tracking-[-0.015rem]",
        className
      )}
    >
      {children}
    </h2>
  );
}

interface ModalDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

function ModalDescription({ children, className }: ModalDescriptionProps) {
  return (
    <div className={cn("text-sm text-primary-text/70", className)}>{children}</div>
  );
}

// ============================================================================
// MODAL BODY
// ============================================================================

interface ModalBodyProps {
  children: React.ReactNode;
  className?: string;
  scrollable?: boolean;
}

function ModalBody({ children, className, scrollable = true }: ModalBodyProps) {
  return (
    <div
      className={cn(
        "px-6 pb-6",
        scrollable && "max-h-[80vh] overflow-y-auto",
        className
      )}
    >
      {children}
    </div>
  );
}

// ============================================================================
// MODAL FOOTER
// ============================================================================

interface ModalFooterProps {
  children: React.ReactNode;
  className?: string;
}

function ModalFooter({ children, className }: ModalFooterProps) {
  return (
    <div
      className={cn(
        "px-6 pb-6 pt-2 flex items-center justify-end gap-3",
        className
      )}
    >
      {children}
    </div>
  );
}

// ============================================================================
// UTILITY COMPONENTS
// ============================================================================

interface ProgressIndicatorProps {
  current: number;
  total: number;
  size?: "sm" | "md" | "lg";
  color?: string;
  className?: string;
}

function ProgressIndicator({
  current,
  total,
  size = "sm",
  color = "#3B82F6",
  className = "",
}: ProgressIndicatorProps) {
  // Calculate size dimensions
  const sizeMap = {
    sm: 64,
    md: 96,
    lg: 128,
  };

  const width = sizeMap[size];
  const strokeWidth = 7.4132; // This creates the visible ring thickness
  const radius = (width - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Calculate progress percentage
  const progress = (current / total) * circumference;

  // Calculate the dash offset to start from top and go clockwise
  const dashOffset = circumference - progress;

  return (
    <div
      className={`relative ${className}`}
      style={{ width: `${width}px`, height: `${width}px` }}
    >
      {/* Centered text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xl font-bold leading-[1.2rem] text-primary-text">
          {current}/{total}
        </span>
      </div>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={width}
        viewBox={`0 0 ${width} ${width}`}
        fill="none"
        style={{ transform: "rotate(-90deg)" }} // Start from top
      >
        {/* Background circle (gray) */}
        <circle
          cx={width / 2}
          cy={width / 2}
          r={radius}
          fill="none"
          stroke="#F4F4F5"
          strokeWidth={strokeWidth}
        />

        {/* Progress circle (blue) */}
        <circle
          cx={width / 2}
          cy={width / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
      </svg>
    </div>
  );
}

// ============================================================================
// LIST ITEM COMPONENTS
// ============================================================================

interface ListItemProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  active?: boolean;
  className?: string;
}

function ListItem({
  children,
  icon,
  rightElement,
  onClick,
  disabled,
  active,
  className,
}: ListItemProps) {
  const isClickable = onClick && !disabled;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-full flex items-center justify-between gap-4 p-4 rounded-xl transition-all",
        "text-left group relative overflow-hidden",
        isClickable && "cursor-pointer hover:shadow-sm",
        active
          ? "bg-[#EBF5FF] border border-[#A3D4FF]"
          : "bg-[#FCFCFC] border border-[#E1E1E2] hover:border-gray-300 hover:bg-gray-50",
        disabled && "cursor-default opacity-50",
        className
      )}
    >
      {icon && (
        <div className="shrink-0 transition-transform group-hover:scale-105">
          {icon}
        </div>
      )}

      <div className="flex-1 min-w-0">{children}</div>

      {rightElement && <div className="shrink-0">{rightElement}</div>}

      {isClickable && !active && (
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5.00333 2L11 8.018L5 14"
            stroke="#A1A1AA"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}

      {active && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM17.0001 10.4142C17.3906 10.0237 17.3906 9.39051 17.0001 8.99999C16.6096 8.60946 15.9764 8.60946 15.5859 8.99999L10.3495 14.2364L8.05224 11.5563C7.69282 11.137 7.06152 11.0884 6.6422 11.4478C6.22287 11.8073 6.17431 12.4386 6.53373 12.8579L9.53373 16.3579C9.715 16.5694 9.97627 16.6957 10.2546 16.7064C10.5329 16.717 10.8031 16.6112 11.0001 16.4142L17.0001 10.4142Z"
            fill="#299BFF"
          />
        </svg>
      )}
    </button>
  );
}

interface ListItemTitleProps {
  children: React.ReactNode;
  className?: string;
}

function ListItemTitle({ children, className }: ListItemTitleProps) {
  return (
    <h3
      className={cn(
        "text-base font-semibold text-primary-text tracking-[-0.012rem]",
        className
      )}
    >
      {children}
    </h3>
  );
}

interface ListItemDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

function ListItemDescription({
  children,
  className,
}: ListItemDescriptionProps) {
  return (
    <p
      className={cn(
        "text-sm text-primary-text/70 tracking-[-0.00875rem]",
        className
      )}
    >
      {children}
    </p>
  );
}

// ============================================================================
// ICON COMPONENTS
// ============================================================================

interface IconContainerProps {
  children: React.ReactNode;
  variant?: "gradient" | "solid" | "outline";
  color?: string;
  completed?: boolean;
  className?: string;
}

function IconContainer({
  children,
  variant = "gradient",
  className,
}: IconContainerProps) {
  const variants = {
    gradient: "bg-gradient-to-br",
    solid: "bg-current",
    outline: "border-2",
  };

  return (
    <div
      className={cn(
        "relative w-12 h-12 rounded-xl flex items-center justify-center",
        variants[variant],
        className
      )}
    >
      {children}
    </div>
  );
}

export {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalBody,
  ModalFooter,
  ProgressIndicator,
  ListItem,
  ListItemTitle,
  ListItemDescription,
  IconContainer,
};

export type {
  ModalProps,
  ModalHeaderProps,
  ModalTitleProps,
  ModalDescriptionProps,
  ModalBodyProps,
  ModalFooterProps,
  ProgressIndicatorProps,
  ListItemProps,
  IconContainerProps,
};
