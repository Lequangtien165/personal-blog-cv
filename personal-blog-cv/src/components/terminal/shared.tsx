import { site } from "@/lib/site";

/**
 * Shell prompt prefix, e.g. "qt@portfolio:~$".
 * Decorative — screen readers get context from surrounding labels.
 */
export function Prompt() {
  return (
    <span className="cmd-prompt" aria-hidden="true">
      {site.promptUser}@{site.promptHost}:~$
    </span>
  );
}
