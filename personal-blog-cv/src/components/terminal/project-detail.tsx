"use client";

import { useEffect, useRef } from "react";
import type { ProjectItem } from "@/lib/projects";
import { projects } from "@/lib/projects";

interface ProjectDetailProps {
  project: ProjectItem;
  mediaOpen: boolean;
  onClose: () => void;
  onBack: () => void;
  onOpenMedia: (src: string) => void;
}

export function ProjectDetail({
  project,
  mediaOpen,
  onClose,
  onBack,
  onOpenMedia,
}: ProjectDetailProps) {
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const mediaOpenRef = useRef(mediaOpen);

  useEffect(() => {
    mediaOpenRef.current = mediaOpen;
  }, [mediaOpen]);

  useEffect(() => {
    restoreFocusRef.current = document.activeElement as HTMLElement | null;
    closeBtnRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !mediaOpenRef.current) onClose();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      restoreFocusRef.current?.focus?.();
    };
  }, [onClose]);

  const total = projects.length;

  return (
    <div
      className="detail-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={`Project detail: ${project.title}`}
    >
      <div className="detail-window">
        {/* Titlebar */}
        <div className="detail-window__titlebar">
          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            <span style={{ color: "var(--accent)" }}>$</span> cat{" "}
            {project.fileName}
          </span>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            aria-label="Close project detail (Escape)"
            className="term-btn"
            style={{ flexShrink: 0 }}
          >
            [close]
          </button>
        </div>

        {/* Body */}
        <div className="detail-window__body">
          <div className="cs-breadcrumb">
            <button
              type="button"
              className="cs-back"
              onClick={onBack}
            >
              back /projects/
            </button>{" "}
            / {project.fileName}
          </div>

          <div>
            <span className="cmd-prompt">$</span> cat {project.fileName}
          </div>

          <div className="section-gap">
            <div className="cs-num">
              {project.number} / {String(total).padStart(2, "0")}
            </div>
            <div className="cs-title">{project.title}</div>
            <div className="cs-tagline">{project.subtitle}</div>
            <div className="cs-meta-row">
              <div className="cs-meta-item">
                <span className="mk">ROLE</span>
                <span className="mv">{project.role}</span>
              </div>
              <div className="cs-meta-item">
                <span className="mk">YEAR</span>
                <span className="mv">{project.year}</span>
              </div>
              <div className="cs-meta-item">
                <span className="mk">TYPE</span>
                <span className="mv">{project.type}</span>
              </div>
              <div className="cs-meta-item">
                <span className="mk">STATUS</span>
                <span className="mv-green">{project.status}</span>
              </div>
            </div>
          </div>

          <div className="cs-body">
            <div className="cs-section-title">// overview</div>
            <p>{project.description}</p>

            <div className="cs-section-title">// stack</div>
            <p>
              <span className="hl">{project.tools}</span>
            </p>

            <div className="cs-section-title">// key skills</div>
            <p>{project.skills}</p>

            <div className="cs-section-title">
              // implementation highlights
            </div>
            {project.features.map((feat, i) => (
              <p key={i}>
                <span className="hl">
                  {String(i + 1).padStart(2, "0")}.
                </span>{" "}
                {feat}
              </p>
            ))}
          </div>

          {/* Media */}
          <div className="cs-section" style={{ marginTop: "24px" }}>
            <div className="cs-section-title">// media</div>
            <button
              type="button"
              onClick={() => onOpenMedia(project.mediaSrc)}
              style={{
                display: "block",
                width: "100%",
                maxWidth: "100%",
                border: "1px dashed var(--border)",
                background: "var(--surface)",
                padding: "28px 20px",
                cursor: "pointer",
                fontSize: "12px",
                color: "var(--dim)",
                textAlign: "center",
                fontFamily: "inherit",
                position: "relative",
              }}
              aria-label={`View architecture preview for ${project.title}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={project.mediaSrc}
                alt={`Architecture preview — ${project.title}`}
                loading="lazy"
                style={{
                  width: "100%",
                  display: "block",
                  border: "1px solid var(--border)",
                  objectFit: "cover",
                  aspectRatio: "16/9",
                }}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
              <span
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  fontSize: "11px",
                  background: "rgba(15,18,16,.88)",
                  border: "1px solid var(--accent-border)",
                  padding: "4px 10px",
                  color: "var(--accent)",
                }}
              >
                ↗ CLICK TO EXPAND
              </span>
            </button>
          </div>

          <div style={{ marginTop: "24px", display: "flex", flexWrap: "wrap", gap: "8px" }}>
            <a
              href={project.liveLink}
              target="_blank"
              rel="noopener noreferrer"
              className="open-btn"
            >
              $ open GITHUB ↗
            </a>
            <button type="button" onClick={onBack} className="open-btn">
              $ back /projects/
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
