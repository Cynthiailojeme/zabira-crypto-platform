"use client";

import { ArrowDown, ArrowUp, ChevronRight } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../ui/table";
import { cn } from "../ui/utils";

type Status = "success" | "pending" | "cancelled";

const statusStyles: Record<Status, string> = {
  success: "bg-emerald-50 text-emerald-600",
  pending: "bg-orange-50 text-orange-600",
  cancelled: "bg-red-50 text-red-600",
};

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-3 py-1 text-xs font-medium capitalize",
        statusStyles[status]
      )}
    >
      {status}
    </span>
  );
}

export function TypeCell({ type }: { type: string }) {
  const isDeposit = type === "deposit";

  return (
    <div className="flex items-center gap-2">
      {isDeposit ? (
        <ArrowDown className="h-4 w-4 text-emerald-600" />
      ) : (
        <ArrowUp className="h-4 w-4 text-red-500" />
      )}
      <span className="capitalize">{type}</span>
    </div>
  );
}

type Transaction = {
  id: string;
  channel: string;
  type: string;
  amount: string;
  fee: string;
  total: string;
  reference: string;
  status: string;
  date: string;
  time: string;
};

export function RecentTransactionsTable({ data }: { data: Transaction[] }) {
  return (
    <div className="hidden lg:grid rounded-2xl border border-[#F1F1F1] bg-white p-6">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 mb-6 bg-base-surface rounded-lg">
        <h3 className="text-base font-semibold text-primary-text tracking-[-0.012rem]">Recent Transactions</h3>
        <button className="text-sm font-medium text-primary-blue flex items-center tracking-[-0.0105rem] hover:underline">
          View All <ChevronRight className="h-5 w-5"/>
        </button>
      </div>

      <Table className="border-t border-[#EEEFF2]">
        <TableHeader>
          <TableRow>
            <TableHead className="px-1.5">Channel</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Fee</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Reference ID</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((tx) => (
            <TableRow key={tx.id} className="h-18">
              <TableCell className="px-1.5 font-medium">{tx.channel}</TableCell>

              <TableCell>
                <TypeCell type={tx.type} />
              </TableCell>

              <TableCell className="font-medium">{tx.amount}</TableCell>

              <TableCell>{tx.fee}</TableCell>

              <TableCell className="font-medium">{tx.total}</TableCell>

              <TableCell className="max-w-40 truncate text-[#718096]">
                {tx.reference}
              </TableCell>

              <TableCell>
                <StatusBadge status={tx.status as Status} />
              </TableCell>

              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium">{tx.date}</span>
                  <span className="text-xs text-[#718096]">
                    {tx.time}
                  </span>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
