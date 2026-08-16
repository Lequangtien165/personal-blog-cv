"use client";

import { site } from "@/lib/site";

const ASCII_NAME = ` ________  _________        ________  ________
|\\   __  \\|\\___   ___\\      |\\   __  \\|\\   ____\\
\\ \\  \\|\\  \\|___ \\  \\_|      \\ \\  \\|\\  \\ \\  \\___|_
 \\ \\  \\\\\\  \\   \\ \\  \\        \\ \\  \\\\\\  \\ \\_____  \\
  \\ \\  \\\\\\  \\   \\ \\  \\        \\ \\  \\\\\\  \\|____|\\  \\
   \\ \\_____  \\   \\ \\__\\        \\ \\_______\\____\\_\\  \\
    \\|___| \\__\\   \\|__|         \\|_______|\\_________\\
          \\|__|                          \\|_________|`;

export function HeroSection() {
  return (
    <div id="page-home">
      <div className="ascii-name">{ASCII_NAME}</div>

      <div>
        <span className="cmd-prompt">$</span> whoami
      </div>

      <div className="section-gap">
        {site.role}. Final-year Computer Networks student at{" "}
        <span style={{ color: "var(--accent)" }}>
          UIT, VNU-HCM
        </span>
        .
        <br />
        Hands-on across the full DevOps lifecycle — infrastructure provisioning,
        deployment, monitoring, and AI-Ops.
        <br />
        Currently building{" "}
        <span style={{ color: "var(--accent)" }}>
          cloud-native infrastructure
        </span>{" "}
        and AI agents for incident detection.
      </div>

      <div className="section-gap">
        <div>
          <span className="cmd-prompt">$</span> cat status.txt
        </div>
        <div style={{ marginTop: "8px" }}>
          <div className="status-line">
            <span className="status-key">LOCATION</span>
            <span>{site.locationShort}</span>
          </div>
          <div className="status-line">
            <span className="status-key">FOCUS</span>
            <span>{site.focus}</span>
          </div>
          <div className="status-line">
            <span className="status-key">CONTACT</span>
            <span>
              <a
                href={`mailto:${site.email}`}
                style={{ color: "var(--fg)", textDecoration: "none" }}
              >
                {site.email}
              </a>
            </span>
          </div>
        </div>
      </div>

      <div className="section-gap">
        <a
          className="live-badge"
          href={site.github}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="dot" />
          {site.status}
        </a>
      </div>

      <div
        className="section-gap dimtext"
        style={{ fontSize: "12px", marginTop: "20px" }}
      >
        TIP: ↑↓ arrows to navigate — type{" "}
        <span style={{ color: "var(--fg)" }}>help</span> for commands
      </div>
    </div>
  );
}
