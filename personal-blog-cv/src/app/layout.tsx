import Link from "next/link";
import { NavLinks } from "@/components/nav-links";
import { ThemeToggle } from "@/components/theme-toggle";
import { Montserrat, Rubik } from "next/font/google";
import Script from "next/script";
import type { Metadata, Viewport } from "next";
import "./globals.css";

const rubik = Rubik({
  subsets: ["latin", "latin-ext"],
  variable: "--font-rubik",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin", "latin-ext"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Quang Tiến",
    template: "%s · Quang Tiến",
  },
  description: "Blog cá nhân, dự án, và hồ sơ của Quang Tiến — DevOps & Cloud Engineer",
  authors: [{ name: "Quang Tiến" }],
  metadataBase: new URL("https://quangtien.id.vn"),
  openGraph: {
    title: "Quang Tiến",
    description: "Blog cá nhân, dự án, và hồ sơ của Quang Tiến",
    type: "website",
    locale: "vi_VN",
    siteName: "Quang Tiến",
  },
  twitter: {
    card: "summary_large_image",
    title: "Quang Tiến",
    description: "Blog cá nhân, dự án, và hồ sơ của Quang Tiến",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafe" },
    { media: "(prefers-color-scheme: dark)", color: "#060b18" },
  ],
};

const themeScript = `(function(){try{var s=localStorage.getItem("theme");var d=window.matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.setAttribute("data-theme",s==="light"?"light":s==="dark"?"dark":d?"dark":"light")}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${rubik.variable} ${montserrat.variable}`} suppressHydrationWarning>
      <head>
        <Script id="theme-init" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <nav className="nav">
          <Link href="/" className="brand-name">Quang Tiến</Link>
          <NavLinks />
          <ThemeToggle />
        </nav>
        {children}
      </body>
    </html>
  );
}
