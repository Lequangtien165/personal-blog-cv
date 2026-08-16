"use client";

import { useSyncExternalStore } from "react";
import { site } from "@/lib/site";

// Cached snapshot for uptime counter
const START = Date.now();

let uptimeSnapshot = "calculating...";

const subscribeUptime = (cb: () => void) => {
  function update() {
    const elapsed = Math.floor((Date.now() - START) / 1000);
    const h = Math.floor(elapsed / 3600);
    const m = Math.floor((elapsed % 3600) / 60);
    const s = elapsed % 60;
    uptimeSnapshot = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    cb();
  }
  update();
  const interval = setInterval(update, 1000);
  return () => clearInterval(interval);
};

const getUptimeSnapshot = () => uptimeSnapshot;
const getUptimeServerSnapshot = () => "calculating...";

export function TerminalHeader() {
  const uptime = useSyncExternalStore(
    subscribeUptime,
    getUptimeSnapshot,
    getUptimeServerSnapshot,
  );

  return (
    <header id="sys-header">
      <div className="sys-left">
        <div className="sys-field">
          SYS.NAME &nbsp;:{" "}
          <span>
            {site.systemName} {site.systemVersion}
          </span>
        </div>
        <div className="sys-field">
          SYS.AUTH &nbsp;:{" "}
          <span className="green">GUEST_ACCESS_GRANTED</span>
        </div>
        <div className="sys-field">
          SYS.NODE &nbsp;: <span>{site.node}</span>
        </div>
      </div>
      <div className="sys-right">
        <div className="sys-field">
          UPTIME &nbsp;&nbsp;&nbsp;:{" "}
          <span suppressHydrationWarning>{uptime}</span>
        </div>
        <div className="sys-field">
          TERMINAL &nbsp;: <span>TTY0</span>
        </div>
        <div className="sys-field">
          STATUS &nbsp;&nbsp;&nbsp;: <span className="orng">200</span>
        </div>
      </div>
    </header>
  );
}
