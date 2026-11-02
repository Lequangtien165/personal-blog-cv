"use client";

import { useEffect, useRef } from "react";

interface MediaModalProps {
  mediaSrc: string | null;
  onClose: () => void;
}

export function MediaModal({ mediaSrc, onClose }: MediaModalProps) {
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
      className="overlay overlay-media"
      role="dialog"
      aria-modal="true"
      aria-label="Media preview"
      onClick={onClose}
    >
      <div className="overlay-bar">
        <span className="label">Preview</span>
        <button
          ref={closeBtnRef}
          type="button"
          onClick={onClose}
          className="overlay-close"
          aria-label="Close media preview (Escape)"
        >
          Close ✕
        </button>
      </div>
      <div className="media-stage" onClick={(e) => e.stopPropagation()}>
        {isVideo ? (
          <video src={mediaSrc} autoPlay controls playsInline />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={mediaSrc} alt="Project preview" />
        )}
      </div>
    </div>
  );
}
