import type { ResumeEntry } from "@/lib/resume";

export function ResumeEntryRow({ entry }: { entry: ResumeEntry }) {
  return (
    <li className="cv-entry">
      <span className="cv-dates">{entry.dates}</span>
      <div className="cv-entry-body">
        <h3 className="cv-entry-title">
          {entry.link ? (
            <a href={entry.link} target="_blank" rel="noopener noreferrer">
              {entry.title}
              <span className="cv-ext" aria-hidden="true">
                ↗
              </span>
              <span className="sr-only"> (GitHub, opens in new tab)</span>
            </a>
          ) : (
            entry.title
          )}
        </h3>
        <p className="cv-entry-org">
          {entry.org}
          {entry.role && <> · {entry.role}</>}
        </p>
        {entry.bullets.length > 0 && (
          <ul className="cv-bullets">
            {entry.bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        )}
        {entry.stack && (
          <ul className="chips" aria-label="Tech stack">
            {entry.stack.map((s) => (
              <li key={s} className="chip">
                {s}
              </li>
            ))}
          </ul>
        )}
      </div>
    </li>
  );
}
