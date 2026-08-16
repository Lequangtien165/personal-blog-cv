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
    default: "Lê Quang Tiến — DevOps & Cloud Infrastructure Engineer",
    template: "%s · Lê Quang Tiến",
  },
  description:
    "QT-OS — Interactive terminal portfolio of Lê Quang Tiến, DevOps & Cloud Infrastructure Engineer in Ho Chi Minh City. AWS, Kubernetes, Terraform, CI/CD, GitOps, Observability & AI-Ops.",
  authors: [{ name: "Lê Quang Tiến" }],
  metadataBase: new URL("https://quangtien.id.vn"),
  openGraph: {
    title: "Lê Quang Tiến — DevOps & Cloud Infrastructure Engineer",
    description:
      "QT-OS — Interactive terminal portfolio of Lê Quang Tiến, DevOps & Cloud Infrastructure Engineer in Ho Chi Minh City. AWS, Kubernetes, Terraform, CI/CD, GitOps, Observability & AI-Ops.",
    type: "website",
    locale: "vi_VN",
    siteName: "QT-OS // Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lê Quang Tiến — DevOps & Cloud Infrastructure Engineer",
    description:
      "QT-OS — Interactive terminal portfolio of Lê Quang Tiến, DevOps & Cloud Infrastructure Engineer in Ho Chi Minh City. AWS, Kubernetes, Terraform, CI/CD, GitOps, Observability & AI-Ops.",
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
