"use client";

import { useEffect, useRef } from "react";

interface MediaModalProps {
  mediaSrc: string | null;
  fileName: string;
  onClose: () => void;
}

export function MediaModal({ mediaSrc, fileName, onClose }: MediaModalProps) {
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!mediaSrc) return;

    restoreFocusRef.current = document.activeElement as HTMLElement | null;
    closeBtnRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      restoreFocusRef.current?.focus?.();
    };
  }, [mediaSrc, onClose]);

  if (!mediaSrc) return null;

  const isVideo = mediaSrc.endsWith(".mp4") || mediaSrc.endsWith(".webm");

  return (
    <div
      className="detail-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={`Media preview: ${fileName}`}
    >
      <div className="detail-window" style={{ maxWidth: "1080px" }}>
        <div className="detail-window__titlebar">
          <span
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            <span style={{ color: "var(--accent)" }}>$</span> open {fileName}
          </span>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            aria-label="Close media preview (Escape)"
            className="term-btn"
            style={{ flexShrink: 0 }}
          >
            [close]
          </button>
        </div>

        <div
          className="detail-window__body"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background:
              "linear-gradient(180deg,rgba(22,26,21,.42),rgba(15,18,16,.88))",
          }}
        >
          {isVideo ? (
            <video
              src={mediaSrc}
              autoPlay
              controls
              playsInline
              style={{ maxHeight: "70vh", width: "100%", objectFit: "contain" }}
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={mediaSrc}
              alt="Architecture preview"
              style={{
                maxHeight: "70vh",
                width: "100%",
                objectFit: "contain",
                border: "1px solid var(--border)",
              }}
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          )}
        </div>

        <div
          style={{
            padding: "8px 12px",
            borderTop: "1px solid var(--border)",
            fontSize: "10px",
            color: "var(--dim)",
          }}
        >
          press Esc to close
        </div>
      </div>
    </div>
  );
}