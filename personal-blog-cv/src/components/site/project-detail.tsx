"use client";

import { useEffect, useRef } from "react";
import type { ProjectItem } from "@/lib/projects";
import { projects } from "@/lib/projects";

interface ProjectDetailProps {
  project: ProjectItem;
  mediaOpen: boolean;
  onClose: () => void;
  onOpenMedia: (src: string) => void;
}

export function ProjectDetail({
  project,
  mediaOpen,
  onClose,
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

  const total = String(projects.length).padStart(2, "0");

  return (
    <div
      className="overlay"
      role="dialog"
      aria-modal="true"
      aria-label={`Project detail: ${project.title}`}
    >
      <div className="overlay-bar">
        <span className="label">
          Case study {project.number} / {total}
        </span>
        <button
          ref={closeBtnRef}
          type="button"
          onClick={onClose}
          className="overlay-close"
          aria-label="Close project detail (Escape)"
        >
          Close ✕
        </button>
      </div>

      <article className="overlay-body shell">
        <h2 className="detail-title">{project.title}</h2>
        <p className="detail-sub">{project.subtitle}</p>

        <dl className="detail-meta">
          <div>
            <dt>Role</dt>
            <dd>{project.role}</dd>
          </div>
          <div>
            <dt>Year</dt>
            <dd>{project.year}</dd>
          </div>
          <div>
            <dt>Type</dt>
            <dd>{project.type}</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>
              <span className="status-dot" aria-hidden="true" /> {project.status}
            </dd>
          </div>
        </dl>

        <button
          type="button"
          className="detail-media"
          onClick={() => onOpenMedia(project.mediaSrc)}
          aria-label={`Expand preview image for ${project.title}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={project.mediaSrc} alt="" loading="lazy" />
          <span className="detail-media-hint">Expand ↗</span>
        </button>

        <div className="detail-grid">
          <section>
            <h3 className="label">Overview</h3>
            <p className="detail-text">{project.description}</p>
            <h3 className="label">Stack</h3>
            <p className="detail-text">{project.tools}</p>
            <h3 className="label">Key skills</h3>
            <p className="detail-text">{project.skills}</p>
          </section>
          <section>
            <h3 className="label">Implementation highlights</h3>
            <ol className="detail-list">
              {project.features.map((feat, i) => (
                <li key={i}>
                  <span className="principle-num">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{feat}</span>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <div className="detail-actions">
          <a
            href={project.liveLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-solid"
          >
            View on GitHub ↗
          </a>
          <button type="button" onClick={onClose} className="btn">
            Back to projects
          </button>
        </div>
      </article>
    </div>
  );
}
