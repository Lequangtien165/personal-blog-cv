"use client";

import { site } from "@/lib/site";

interface NavBarProps {
  activePage: string;
  onNavigate: (pageId: string) => void;
}

const NAV_ITEMS = [
  { id: "home", label: "01._HOME" },
  { id: "work", label: "02._WORK" },
  { id: "about", label: "03._ABOUT" },
  { id: "resume", label: "04._RESUME" },
  { id: "journal", label: "05._JOURNAL" },
];

export function NavBar({ activePage, onNavigate }: NavBarProps) {
  return (
    <nav id="nav-bar" aria-label="Main navigation">
      <div className="nav-prompt">
        {site.promptUser}@{site.promptHost}/nav &gt; SELECT MODULE [↑↓ arrows +
        ENTER or click]
      </div>
      <div className="nav-list">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`nav-item${activePage === item.id ? " active" : ""}`}
            onClick={() => onNavigate(item.id)}
            aria-current={activePage === item.id ? "page" : undefined}
          >
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
