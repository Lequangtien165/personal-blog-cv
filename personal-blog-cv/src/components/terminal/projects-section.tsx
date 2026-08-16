"use client";

import { useState, useCallback } from "react";
import { projects } from "@/lib/projects";

interface ProjectsSectionProps {
  onOpen: (id: string) => void;
}

export function ProjectsSection({ onOpen }: ProjectsSectionProps) {
  const [openMeta, setOpenMeta] = useState<string | null>(null);

  const toggleMeta = useCallback((id: string) => {
    setOpenMeta((prev) => (prev === id ? null : id));
  }, []);

  return (
    <div id="page-work">
      <div>
        <span className="cmd-prompt">$</span> ls -la /projects/
      </div>
      <div
        className="dimtext"
        style={{ fontSize: "12px", margin: "6px 0 4px" }}
      >
        {projects.length} entries — click filename to expand — click [OPEN] to
        read case study
      </div>

      <div className="file-table">
        {/* Column headers (desktop) */}
        <div className="file-row hdr">
          <span>NAME</span>
          <span>SIZE</span>
          <span>MODIFIED</span>
          <span>DESCRIPTION</span>
        </div>

        {projects.map((p) => (
          <div key={p.id}>
            <div className="file-row">
              <button
                type="button"
                className="file-name"
                onClick={() => toggleMeta(p.id)}
              >
                {p.fileName}
              </button>
              <span className="file-size">{p.size}</span>
              <span className="file-date">{p.year}</span>
              <span className="dimtext">{p.subtitle}</span>
            </div>

            {openMeta === p.id && (
              <div className="file-meta">
                <div className="fm-row">
                  <span className="fm-key">DESC</span>
                  <span>{p.description}</span>
                </div>
                <div className="fm-row">
                  <span className="fm-key">ROLE</span>
                  <span>{p.role}</span>
                </div>
                <div className="fm-row">
                  <span className="fm-key">STACK</span>
                  <span>{p.tools}</span>
                </div>
                <div className="fm-row">
                  <span className="fm-key">STATUS</span>
                  <span className="fm-shipped">{p.status}</span>
                </div>
                <button
                  type="button"
                  className="open-btn"
                  onClick={() => onOpen(p.id)}
                >
                  $ cat {p.fileName} [OPEN]
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
