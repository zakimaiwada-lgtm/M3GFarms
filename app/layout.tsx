import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "M3G Farms | Growing today. Feeding tomorrow.",
  description:
    "M3G Farm Limited connects sustainable forage production, livestock farming, agro processing, and agribusiness development from Abuja, Nigeria.",
  openGraph: {
    title: "M3G Farms | Growing today. Feeding tomorrow.",
    description: "A sustainable agricultural future, rooted in Nigeria.",
    type: "website",
  },
  icons: { icon: "/favicon.svg" },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
