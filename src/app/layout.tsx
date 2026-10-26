import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Stock Trend Studio",
  description: "Riset niche Adobe Stock dan generator prompt.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="id"><body>{children}</body></html>;
}
