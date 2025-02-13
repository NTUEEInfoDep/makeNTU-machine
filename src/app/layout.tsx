import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import HeadBar from "../components/HeadBar";
import { AccountProvider } from "@/context/Account";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MakeNTU Machine",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className + " bg-background"}>
        <AccountProvider>
          <HeadBar />
          {children}
        </AccountProvider>
      </body>
    </html>
  );
}
