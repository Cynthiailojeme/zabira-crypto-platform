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
        {rightElement && <div className="shrink-0">{rightElement}</div>}
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
    <h2 className={cn("text-xl font-bold text-primary-text mb-1 tracking-[-0.015rem]", className)}>
      {children}
    </h2>
  );
}

interface ModalDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

function ModalDescription({ children, className }: ModalDescriptionProps) {
  return <p className={cn("text-sm text-primary-text/70", className)}>{children}</p>;
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
        scrollable && "max-h-[60vh] overflow-y-auto",
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
  size = "md",
  color = "#3B82F6",
  className,
}: ProgressIndicatorProps) {
  const sizes = {
    sm: { width: 36, radius: 14, stroke: 3 },
    md: { width: 48, radius: 20, stroke: 4 },
    lg: { width: 64, radius: 28, stroke: 5 },
  };

  const { width, radius, stroke } = sizes[size];
  const circumference = 2 * Math.PI * radius;
  const progress = (current / total) * circumference;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="text-sm font-medium text-gray-900">
        {current}/{total}
      </span>
      <div className={`relative`} style={{ width, height: width }}>
        <svg
          className="transform -rotate-90"
          width={width}
          height={width}
          viewBox={`0 0 ${width} ${width}`}
        >
          <circle
            cx={width / 2}
            cy={width / 2}
            r={radius}
            fill="none"
            stroke="#E5E7EB"
            strokeWidth={stroke}
          />
          <circle
            cx={width / 2}
            cy={width / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeDasharray={`${progress} ${circumference}`}
            strokeLinecap="round"
            className="transition-all duration-500 ease-out"
          />
        </svg>
      </div>
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
        "w-full flex items-center gap-4 p-4 rounded-xl transition-all",
        "text-left group relative overflow-hidden",
        isClickable && "cursor-pointer hover:shadow-sm",
        active
          ? "bg-blue-50"
          : "bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50",
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
          className="shrink-0 w-5 h-5 text-gray-400 transition-transform group-hover:translate-x-0.5"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7.5 15L12.5 10L7.5 5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
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
    <h3 className={cn("text-sm font-semibold text-gray-900 mb-0.5", className)}>
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
  return <p className={cn("text-xs text-gray-500", className)}>{children}</p>;
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
  color = "blue",
  completed,
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
        completed && "bg-white",
        !completed && variant === "gradient" && "from-gray-50 to-gray-100",
        className
      )}
    >
      {children}
      {completed && (
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center shadow-md">
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 3L4.5 8.5L2 6"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}
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
