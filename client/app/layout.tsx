import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./redux/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ClickMaster - The Ultimate Clicking Competition",
  description:
    "Join thousands of players in the ultimate clicking competition. Click faster, climb the leaderboard, and win prizes!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
