import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import "./globals.css";

export const metadata = {
  title: "Quang Tiến - Blog & CV",
  description: "Blog cá nhân, dự án, và hồ sơ của Quang Tiến",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
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