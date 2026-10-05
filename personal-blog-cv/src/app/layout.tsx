import { Geist_Mono } from "next/font/google";
import type { Metadata, Viewport } from "next";
import "./globals.css";

const geistMono = Geist_Mono({
  subsets: ["latin", "latin-ext"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Lê Quang Tiến — System Engineer",
    template: "%s · Lê Quang Tiến",
  },
  description:
    "QT-OS — System Engineer portfolio of Lê Quang Tiến in Ho Chi Minh City, focused on Linux and Windows operations, VMware ESXi, monitoring, troubleshooting, and infrastructure automation.",
  authors: [{ name: "Lê Quang Tiến" }],
  metadataBase: new URL("https://quangtien.id.vn"),
  openGraph: {
    title: "Lê Quang Tiến — System Engineer",
    description:
      "QT-OS — System Engineer portfolio of Lê Quang Tiến in Ho Chi Minh City, focused on Linux and Windows operations, VMware ESXi, monitoring, troubleshooting, and infrastructure automation.",
    type: "website",
    locale: "vi_VN",
    siteName: "QT-OS // Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lê Quang Tiến — System Engineer",
    description:
      "QT-OS — System Engineer portfolio of Lê Quang Tiến in Ho Chi Minh City, focused on Linux and Windows operations, VMware ESXi, monitoring, troubleshooting, and infrastructure automation.",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0f1210",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={geistMono.variable}>
      <body>{children}</body>
    </html>
  );
}
