"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { PostMeta } from "@/lib/content";
import { getProjectById, projects } from "@/lib/projects";
import { site } from "@/lib/site";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { RevealObserver } from "@/components/site/reveal-observer";
import { ProjectDetail } from "@/components/site/project-detail";
import { MediaModal } from "@/components/site/media-modal";

const PROJECT_HASH_PREFIX = "#project=";

function parseProjectHash(): string | null {
  const hash = window.location.hash;
  if (!hash.startsWith(PROJECT_HASH_PREFIX)) return null;
  const id = hash.slice(PROJECT_HASH_PREFIX.length);
  return getProjectById(id) ? id : null;
}

const STACK = [
  "Linux (Ubuntu)",
  "Windows Server",
  "VMware ESXi",
  "Bash",
  "AWS",
  "Terraform",
  "Ansible",
  "Docker",
  "Kubernetes",
  "Prometheus",
  "Grafana",
  "Jenkins",
];

const PRINCIPLES = [
  { word: "Observe", note: "Metrics, logs, health checks" },
  { word: "Diagnose", note: "DNS, network, services, firewalls" },
  { word: "Automate", note: "Terraform, Ansible, pipelines" },
  { word: "Document", note: "Runbooks & recovery steps" },
];

const EXPERIENCE = [
  {
    dates: "Jul 2026 — Sep 2026",
    title: "System Administrator Intern",
    org: "DTP Education Solutions",
    text: "Linux and Windows server administration on VMware ESXi: VM provisioning, snapshots, backup and recovery, monitoring with Grafana and exporters, and network troubleshooting.",
  },
  {
    dates: "Expected Jul 2027",
    title: "B.Eng. Computer Networks & Data Communication",
    org: "UIT, VNU-HCM",
    text: "GPA 8.5/10 · IELTS Academic 6.5 · AWS Cloud Practitioner (CLF-C02) · Google System Administration and IT Infrastructure Services.",
  },
];

function tagsOf(tools: string) {
  return tools
    .split(",")
    .map((t) => t.trim())
    .slice(0, 4);
}

export function HomePage({ posts }: { posts: PostMeta[] }) {
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [activeMedia, setActiveMedia] = useState<string | null>(null);

  useEffect(() => {
    const sync = () => setActiveProjectId(parseProjectHash());
    const timer = window.setTimeout(sync, 0);
    window.addEventListener("hashchange", sync);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("hashchange", sync);
    };
  }, []);

  const openProject = useCallback((id: string) => {
    setActiveProjectId(id);
    const url = new URL(window.location.href);
    url.hash = `${PROJECT_HASH_PREFIX}${id}`;
    history.replaceState(null, "", url);
  }, []);

  const closeProject = useCallback(() => {
    setActiveProjectId(null);
    if (window.location.hash) {
      history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search,
      );
    }
  }, []);

  const anyOverlayOpen = activeProjectId !== null || activeMedia !== null;
  useEffect(() => {
    document.body.style.overflow = anyOverlayOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [anyOverlayOpen]);

  const activeProject = activeProjectId
    ? getProjectById(activeProjectId)
    : null;
  const year = projects
    .map((p) => p.year)
    .sort()
    .at(-1)!
    .slice(-2);
  const latestPosts = posts.slice(0, 6);

  return (
    <>
      <RevealObserver />
      <SiteHeader />

      <main id="main-content">
        {/* HERO */}
        <section className="hero shell" aria-labelledby="hero-title">
          <h1 id="hero-title" className="hero-title">
            <span className="hero-word">
              <span>Systems</span>
            </span>
            <span className="hero-word hero-year">
              <span>
                <span className="accent-tick" aria-hidden="true" />
                <span className="sr-only">&apos;</span>
                {year}
              </span>
            </span>
          </h1>
          <div className="hero-intro" data-reveal>
            <p className="label">Lê Quang Tiến — {site.role}</p>
            <p className="hero-lede">
              I keep Linux, Windows and cloud infrastructure observable,
              automated and recoverable — from VMware ESXi hosts to AWS EKS.
            </p>
            <a className="status-pill" href="#contact">
              <span className="status-dot" aria-hidden="true" />
              {site.status}
            </a>
          </div>
        </section>

        {/* WORK */}
        <section id="work" className="shell section" aria-labelledby="work-title">
          <h2 id="work-title" className="label" data-reveal>
            Selected works
          </h2>
          <div className="work-grid">
            {projects.map((p) => (
              <button
                key={p.id}
                type="button"
                className="work-card"
                onClick={() => openProject(p.id)}
                aria-label={`Open case study: ${p.title}`}
                data-reveal
              >
                <span className="work-media">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.mediaSrc} alt="" loading="lazy" />
                  <span className="work-num">{p.number}</span>
                </span>
                <span className="work-info">
                  <span className="work-title">{p.title}</span>
                  <span className="work-tags">
                    {tagsOf(p.tools).map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* ABOUT */}
        <section id="about" className="shell section" aria-labelledby="about-title">
          <div className="split">
            <div>
              <h2 id="about-title" className="display" data-reveal>
                Hey<span className="dot-accent">.</span>
              </h2>
              <p className="lede" data-reveal>
                I&apos;m a final-year Computer Networks student at UIT,
                VNU-HCM, working toward System Engineer roles. I like the
                parts of infrastructure nobody notices — until they break.
              </p>
            </div>
            <aside className="about-side" data-reveal>
              <h3 className="label">My tech stack</h3>
              <ul className="stack-list">
                {STACK.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </aside>
          </div>

          <div className="how" data-reveal>
            <h3 className="label">How I work</h3>
            <p className="how-text">
              During my System Administrator internship I supported server
              operations on VMware ESXi — provisioning, snapshots, backup and
              recovery, monitoring and troubleshooting. My projects extend that
              into AWS, Terraform, Ansible, containers and alerting pipelines.
            </p>
            <ol className="principles">
              {PRINCIPLES.map((p, i) => (
                <li key={p.word}>
                  <span className="principle-num">0{i + 1}</span>
                  <span className="principle-word">{p.word}</span>
                  <span className="principle-note">{p.note}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* RESUME */}
        <section id="resume" className="shell section" aria-labelledby="resume-title">
          <div className="section-head" data-reveal>
            <h2 id="resume-title" className="display display-sm">
              Resume<span className="dot-accent">.</span>
            </h2>
            <Link href="/cv" className="arrow-link">
              Full CV ↗
            </Link>
          </div>
          <ul className="rows">
            {EXPERIENCE.map((e) => (
              <li key={e.title} className="row" data-reveal>
                <span className="row-meta">{e.dates}</span>
                <span className="row-main">
                  <span className="row-title">{e.title}</span>
                  <span className="row-sub">{e.org}</span>
                </span>
                <span className="row-text">{e.text}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* JOURNAL */}
        <section id="journal" className="shell section" aria-labelledby="journal-title">
          <div className="section-head" data-reveal>
            <h2 id="journal-title" className="display display-sm">
              Journal<span className="dot-accent">.</span>
            </h2>
            <Link href="/blog" className="arrow-link">
              All entries ({posts.length}) ↗
            </Link>
          </div>
          <ul className="rows">
            {latestPosts.map((post) => (
              <li key={post.slug} data-reveal>
                <Link href={`/blog/${post.slug}`} className="row row-link">
                  <span className="row-meta">{post.date}</span>
                  <span className="row-main">
                    <span className="row-title">{post.title}</span>
                  </span>
                  <span className="row-aside">
                    {post.readingTime}
                    <span className="row-arrow" aria-hidden="true">
                      →
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>

      {/* CONTACT */}
      <section id="contact" className="contact" aria-labelledby="contact-title">
        <div className="shell">
          <h2 id="contact-title" className="display" data-reveal>
            Say Hello<span className="dot-accent">.</span>
          </h2>
          <div className="contact-grid" data-reveal>
            <p className="lede">
              Looking for a System Engineer who cares about uptime, clean
              runbooks and calm incident response? Let&apos;s talk.
            </p>
            <div className="contact-links">
              <a className="contact-email" href={`mailto:${site.email}`}>
                {site.email}
              </a>
              <div className="contact-socials">
                <a href={site.linkedin} target="_blank" rel="noopener noreferrer">
                  LinkedIn<span className="sr-only"> (opens in new tab)</span>
                </a>
                <span aria-hidden="true">|</span>
                <a href={site.github} target="_blank" rel="noopener noreferrer">
                  GitHub<span className="sr-only"> (opens in new tab)</span>
                </a>
                <span aria-hidden="true">|</span>
                <Link href="/cv">Resume</Link>
              </div>
            </div>
          </div>
        </div>
        <SiteFooter dark />
      </section>

      {activeProject && (
        <ProjectDetail
          project={activeProject}
          mediaOpen={activeMedia !== null}
          onClose={closeProject}
          onOpenMedia={setActiveMedia}
        />
      )}

      <MediaModal mediaSrc={activeMedia} onClose={() => setActiveMedia(null)} />
    </>
  );
}
