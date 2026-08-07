import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Providers from "@/providers";

import "bootstrap/dist/css/bootstrap.min.css";
import "@/styles/globals.css";
import "@/styles/variables.css";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Assignment Management System",
  description: "School & College Assignment Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}