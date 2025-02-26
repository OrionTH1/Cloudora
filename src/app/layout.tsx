import type { Metadata } from "next";
import { Poppins } from "next/font/google";

import "./globals.css";

export const metadata: Metadata = {
  title: "MyCloud",
  description: "MyCloud - Your new cloud storage is here",
};
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.className} antialiased`}>{children}</body>
    </html>
  );
}
