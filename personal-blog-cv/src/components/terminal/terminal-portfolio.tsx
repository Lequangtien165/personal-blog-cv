"use client";

import { useCallback, useEffect, useState } from "react";
import type { PostMeta } from "@/lib/content";
import { getProjectById } from "@/lib/projects";
import { BootScreen } from "@/components/terminal/boot-screen";
import { TerminalHeader } from "@/components/terminal/terminal-header";
import { HeroSection } from "@/components/terminal/hero-section";
import { ProjectsSection } from "@/components/terminal/projects-section";
import { AboutSection } from "@/components/terminal/about-section";
import { CvSection } from "@/components/terminal/cv-section";
import { JournalSection } from "@/components/terminal/journal-section";
import { ProjectDetail } from "@/components/terminal/project-detail";
import { CommandConsole } from "@/components/terminal/command-console";
import { NavBar } from "@/components/terminal/nav-bar";
import { MediaModal } from "@/components/media-modal";

interface TerminalPortfolioProps {
  posts: PostMeta[];
}

const PROJECT_HASH_PREFIX = "#project=";

function parseProjectHash(): string | null {
  const hash = window.location.hash;
  if (!hash.startsWith(PROJECT_HASH_PREFIX)) return null;
  const id = hash.slice(PROJECT_HASH_PREFIX.length);
  return getProjectById(id) ? id : null;
}

const PAGE_IDS = ["home", "work", "about", "resume", "journal"] as const;
type PageId = (typeof PAGE_IDS)[number];

export function TerminalPortfolio({ posts }: TerminalPortfolioProps) {
  const [activePage, setActivePage] = useState<PageId>("home");
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [activeMedia, setActiveMedia] = useState<string | null>(null);

  // Restore project from URL hash after hydration
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setActiveProjectId(parseProjectHash());
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  // Keep the open project in sync with the URL hash
  useEffect(() => {
    const onHashChange = () => setActiveProjectId(parseProjectHash());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  // Navigate between pages
  const handleNavigate = useCallback((pageId: string) => {
    if (PAGE_IDS.includes(pageId as PageId)) {
      setActivePage(pageId as PageId);
      // Scroll main-output to top when switching pages
      const mainOutput = document.getElementById("main-output");
      if (mainOutput) mainOutput.scrollTop = 0;
    }
  }, []);

  // Open project detail
  const openProject = useCallback((id: string) => {
    setActiveProjectId(id);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.hash = `${PROJECT_HASH_PREFIX}${id}`;
      history.replaceState(null, "", url);
    }
  }, []);

  const closeProject = useCallback(() => {
    setActiveProjectId(null);
    if (
      typeof window !== "undefined" &&
      window.location.hash
    ) {
      history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search,
      );
    }
  }, []);

  const closeProjectAndBack = useCallback(() => {
    closeProject();
    requestAnimationFrame(() => handleNavigate("work"));
  }, [closeProject, handleNavigate]);

  const activeProject = activeProjectId
    ? getProjectById(activeProjectId)
    : null;

  // Lock body scroll whenever any overlay is open
  const anyOverlayOpen = activeProjectId !== null || activeMedia !== null;
  useEffect(() => {
    document.body.style.overflow = anyOverlayOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [anyOverlayOpen]);

  // Keyboard navigation: ↑↓ arrows to switch pages
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      )
        return;
      if (anyOverlayOpen) return;

      const currentIdx = PAGE_IDS.indexOf(activePage);
      if (e.key === "ArrowUp" && currentIdx > 0) {
        e.preventDefault();
        handleNavigate(PAGE_IDS[currentIdx - 1]);
      } else if (
        e.key === "ArrowDown" &&
        currentIdx < PAGE_IDS.length - 1
      ) {
        e.preventDefault();
        handleNavigate(PAGE_IDS[currentIdx + 1]);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activePage, anyOverlayOpen, handleNavigate]);

  return (
    <>
      <BootScreen />

      <div id="app-shell">
        <TerminalHeader />

        <div id="main-output">
          {/* HOME */}
          <div className={activePage === "home" ? "page active" : "page"}>
            <HeroSection />
          </div>

          {/* WORK */}
          <div className={activePage === "work" ? "page active" : "page"}>
            <ProjectsSection onOpen={openProject} />
          </div>

          {/* ABOUT */}
          <div className={activePage === "about" ? "page active" : "page"}>
            <AboutSection />
          </div>

          {/* RESUME */}
          <div className={activePage === "resume" ? "page active" : "page"}>
            <CvSection />
          </div>

          {/* JOURNAL */}
          <div className={activePage === "journal" ? "page active" : "page"}>
            <JournalSection posts={posts} />
          </div>
        </div>

        <CommandConsole onNavigate={handleNavigate} />
        <NavBar activePage={activePage} onNavigate={handleNavigate} />
      </div>

      {activeProject && (
        <ProjectDetail
          project={activeProject}
          mediaOpen={activeMedia !== null}
          onClose={closeProject}
          onBack={closeProjectAndBack}
          onOpenMedia={setActiveMedia}
        />
      )}

      <MediaModal
        mediaSrc={activeMedia}
        fileName={
          activeMedia ? activeMedia.split("/").pop() ?? "media" : "media"
        }
        onClose={() => setActiveMedia(null)}
      />
    </>
  );
}