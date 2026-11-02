import { Geist_Mono, Inter_Tight } from "next/font/google";
import type { Metadata, Viewport } from "next";
import "./globals.css";

const interTight = Inter_Tight({
  subsets: ["latin", "latin-ext", "vietnamese"],
  variable: "--font-inter-tight",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin", "latin-ext"],
  variable: "--font-geist-mono",
  display: "swap",
});

const description =
  "Portfolio of Lê Quang Tiến, a System Engineer in Ho Chi Minh City focused on Linux and Windows operations, VMware ESXi, monitoring, troubleshooting, and infrastructure automation.";

export const metadata: Metadata = {
  title: {
    default: "Lê Quang Tiến — System Engineer",
    template: "%s · Lê Quang Tiến",
  },
  description,
  authors: [{ name: "Lê Quang Tiến" }],
  metadataBase: new URL("https://quangtien.id.vn"),
  openGraph: {
    title: "Lê Quang Tiến — System Engineer",
    description,
    type: "website",
    locale: "vi_VN",
    siteName: "Lê Quang Tiến",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lê Quang Tiến — System Engineer",
    description,
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f6f6f6",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={`${interTight.variable} ${geistMono.variable}`}>
      <body>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <div className="grid-lines" aria-hidden="true">
          {Array.from({ length: 12 }, (_, i) => (
            <span key={i} />
          ))}
        </div>
        {children}
      </body>
    </html>
  );
}
