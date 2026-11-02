import type { Metadata } from "next";
import { PageShell } from "@/components/site/page-shell";
import { PrintButton } from "@/components/site/print-button";
import { ResumeEntryRow } from "@/components/site/resume-entry";
import { site } from "@/lib/site";
import {
  certificates,
  education,
  experience,
  phone,
  profile,
  resumeProjects,
  skills,
} from "@/lib/resume";

export const metadata: Metadata = {
  title: "CV",
  description:
    "CV của Lê Quang Tiến — System Engineer, IT operations, Linux, Windows Server và VMware ESXi",
};

function CvSection({
  num,
  title,
  children,
}: {
  num: string;
  title: string;
  children: React.ReactNode;
}) {
  const id = `cv-${title.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <section className="cv-section" aria-labelledby={id}>
      <h2 id={id} className="cv-label">
        <span className="principle-num">{num}</span>
        <span>{title}</span>
      </h2>
      <div className="cv-content">{children}</div>
    </section>
  );
}

export default function CvPage() {
  return (
    <PageShell active="resume">
      <header className="cv-head">
        <h1 className="display">
          Resume<span className="dot-accent">.</span>
        </h1>

        <div className="cv-intro">
          <p className="cv-name">
            {site.name}
            <span>{site.role}</span>
          </p>
          <dl className="detail-meta cv-contact">
            <div>
              <dt>Email</dt>
              <dd>
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </dd>
            </div>
            <div>
              <dt>Phone</dt>
              <dd>
                <a href={`tel:${phone.replace(/\s+/g, "")}`}>{phone}</a>
              </dd>
            </div>
            <div>
              <dt>Location</dt>
              <dd>{site.location}</dd>
            </div>
            <div>
              <dt>Links</dt>
              <dd className="cv-links">
                <a href={site.github} target="_blank" rel="noopener noreferrer">
                  GitHub ↗
                </a>
                <a href={site.linkedin} target="_blank" rel="noopener noreferrer">
                  LinkedIn ↗
                </a>
              </dd>
            </div>
          </dl>
          <div className="detail-actions cv-actions">
            <a href={`mailto:${site.email}`} className="btn btn-solid">
              Get in touch
            </a>
            <PrintButton />
          </div>
        </div>
      </header>

      <CvSection num="01" title="Profile">
        <p className="cv-profile">{profile}</p>
      </CvSection>

      <CvSection num="02" title="Experience">
        <ul className="cv-list">
          {experience.map((e) => (
            <ResumeEntryRow key={e.title} entry={e} />
          ))}
        </ul>
      </CvSection>

      <CvSection num="03" title="Projects">
        <ul className="cv-list">
          {resumeProjects.map((e) => (
            <ResumeEntryRow key={e.title} entry={e} />
          ))}
        </ul>
      </CvSection>

      <CvSection num="04" title="Education">
        <ul className="cv-list">
          {education.map((e) => (
            <ResumeEntryRow key={e.title} entry={e} />
          ))}
        </ul>
      </CvSection>

      <CvSection num="05" title="Certificates">
        <ul className="cv-list">
          {certificates.map((c) => (
            <ResumeEntryRow key={c.title} entry={{ ...c, bullets: [] }} />
          ))}
        </ul>
      </CvSection>

      <CvSection num="06" title="Skills">
        <div className="cv-skills">
          {skills.map((s) => (
            <div key={s.group} className="cv-skill">
              <h3 className="cv-skill-title">{s.group}</h3>
              <ul className="chips">
                {s.items.map((i) => (
                  <li key={i} className="chip">
                    {i}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </CvSection>
    </PageShell>
  );
}
