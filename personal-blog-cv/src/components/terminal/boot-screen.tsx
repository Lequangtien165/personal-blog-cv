"use client";

import { useEffect, useState } from "react";

const BOOT_LINES = [
  "INITIALIZING QT-OS",
  "LOADING PROFILE",
  "MOUNTING PROJECTS",
  "MOUNTING JOURNAL",
  "CHECKING SYSTEM STATUS",
  "ACCESS GRANTED",
] as const;

/**
 * Boot overlay. Server-rendered so first paint matches hydration exactly.
 * Uses CSS animation delays for the typing effect, then fades out.
 */
export function BootScreen() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const delay = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? 0
      : 2100;
    const timer = setTimeout(() => setDone(true), delay);
    return () => clearTimeout(timer);
  }, []);

  if (done) return null;

  return (
    <div className="boot-overlay" aria-hidden="true">
      <div className="boot-sequence">
        {BOOT_LINES.map((line, i) => (
          <span
            key={line}
            className={`boot-line${
              i === BOOT_LINES.length - 1 ? " boot-line--granted" : ""
            }`}
          >
            {line}
          </span>
        ))}
      </div>
    </div>
  );
}
