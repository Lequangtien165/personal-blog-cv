"use client";

import { useRef, useState, useEffect } from "react";
import { site } from "@/lib/site";

interface CommandConsoleProps {
  onNavigate: (pageId: string) => void;
}

export function CommandConsole({ onNavigate }: CommandConsoleProps) {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState<number | null>(null);
  const draftRef = useRef("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Global keyboard shortcut: focus command bar on "/" key
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "/" &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const execute = (raw: string) => {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;

    setCmdHistory((prev) => [...prev, cmd]);
    setHistoryIdx(null);
    draftRef.current = "";

    switch (cmd) {
      case "help":
        setResponse(
          [
            "available commands:",
            "  home       go to home page",
            "  work       list projects",
            "  about      about me",
            "  resume     open resume",
            "  journal    go to journal",
            "  clear      clear response",
          ].join("\n"),
        );
        break;
      case "home":
        setResponse("navigating to home...");
        onNavigate("home");
        break;
      case "work":
      case "projects":
        setResponse("opening /projects ...");
        onNavigate("work");
        break;
      case "about":
        setResponse("opening /about ...");
        onNavigate("about");
        break;
      case "resume":
      case "cv":
        setResponse("opening /resume ...");
        onNavigate("resume");
        break;
      case "journal":
      case "blog":
        setResponse("opening /journal ...");
        onNavigate("journal");
        break;
      case "clear":
        setResponse(null);
        break;
      default:
        setResponse(
          `${cmd}: command not found. type help for available commands.`,
        );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    execute(input);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (cmdHistory.length === 0) return;
      setHistoryIdx((idx) => {
        const next =
          idx === null ? cmdHistory.length - 1 : Math.max(0, idx - 1);
        if (idx === null) draftRef.current = input;
        setInput(cmdHistory[next]);
        return next;
      });
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIdx === null) return;
      if (historyIdx >= cmdHistory.length - 1) {
        setHistoryIdx(null);
        setInput(draftRef.current);
      } else {
        const next = historyIdx + 1;
        setHistoryIdx(next);
        setInput(cmdHistory[next]);
      }
    } else if (e.key === "Escape") {
      setInput("");
      setHistoryIdx(null);
      inputRef.current?.blur();
    }
  };

  return (
    <>
      {response && (
        <div className="cmd-response">{response}</div>
      )}
      <form id="cmd-bar" onSubmit={handleSubmit}>
        <span className="prompt-label">
          {site.promptUser}@{site.promptHost}:~$
        </span>
        <div className="cmd-entry">
          <label htmlFor="cmd-input" className="sr-only">
            Terminal command input
          </label>
          <input
            ref={inputRef}
            id="cmd-input"
            type="text"
            className="cmd-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="type a command (try: help)"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            enterKeyHint="send"
          />
        </div>
      </form>
    </>
  );
}
