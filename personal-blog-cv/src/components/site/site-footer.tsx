"use client";

import { useSyncExternalStore } from "react";
import { site } from "@/lib/site";

const formatter = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: site.timeZone,
});

function subscribe(cb: () => void) {
  const id = window.setInterval(cb, 10_000);
  return () => window.clearInterval(id);
}

const getTime = () => formatter.format(new Date());
const getServerTime = () => "--:--";

export function SiteFooter({ dark = false }: { dark?: boolean }) {
  const time = useSyncExternalStore(subscribe, getTime, getServerTime);

  return (
    <footer className={dark ? "site-footer is-dark" : "site-footer"}>
      <div>
        <div className="footer-city">
          {site.city} - <time suppressHydrationWarning>{time}</time>
        </div>
        <div className="footer-coords">{site.coords}</div>
      </div>
      <div className="footer-meta">
        © {new Date().getFullYear()} {site.name}
      </div>
    </footer>
  );
}
