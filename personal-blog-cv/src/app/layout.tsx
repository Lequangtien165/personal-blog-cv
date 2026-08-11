import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { Montserrat, Rubik } from "next/font/google";
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

export const metadata = {
  title: "Quang Tien",
  description: "Blog cá nhân, dự án, và hồ sơ của Quang Tiến",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${rubik.variable} ${montserrat.variable}`}>
      <body>
        <nav className="nav">
          <Link href="/" className="brand-name">Quang Tiến</Link>
          <div className="nav-links">
            <Link href="/">Blog</Link>
            <Link href="/cv">CV</Link>
          </div>
          <ThemeToggle />
        </nav>
        {children}
      </body>
    </html>
  );
}