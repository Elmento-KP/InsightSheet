import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "InsightSheet",
  description: "Upload spreadsheets and generate dashboards, charts, insights, and forecasting.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
