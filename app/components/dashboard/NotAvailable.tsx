"use client";

import { AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function NotAvailable() {
  return (
    <div className="flex h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
          <AlertTriangle className="h-6 w-6 text-yellow-600" />
        </div>

        <h1 className="mb-2 text-xl font-semibold text-primary-text">
          Page not available
        </h1>

        <p className="mb-6 text-sm text-primary-text/70">
          This page is currently unavailable or under construction. Please check
          back later or return to the dashboard.
        </p>

        <div className="flex justify-center gap-3">
          <Link
            href="/"
            className="rounded-lg bg-primary-blue px-4 py-2 text-sm font-medium text-white hover:bg-primary-blue/80 transition"
          >
            Go to dashboard
          </Link>

          <button
            onClick={() => window.history.back()}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
          >
            Go back
          </button>
        </div>
      </div>
    </div>
  );
}
