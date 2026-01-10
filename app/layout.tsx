import type { Metadata } from "next";
import { Geist } from 'next/font/google'
import "./globals.css";
import ClientLayout from "./components/layout/ClientLayout";

export const metadata: Metadata = {
  title: "Zabira",
  description: "Your dashboard application",
};

const geist = Geist({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-geist',
  display: 'swap',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={geist.variable}>
      <body className="antialiased">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}