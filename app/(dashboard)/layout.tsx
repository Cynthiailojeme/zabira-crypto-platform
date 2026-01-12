import type { ReactNode } from "react";
import { ProtectedRoute } from "../components/layout/DashboardLayout";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
