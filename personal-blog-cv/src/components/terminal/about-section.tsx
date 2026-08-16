import { site } from "@/lib/site";

export function AboutSection() {
  return (
    <div id="page-about">
      <div>
        <span className="cmd-prompt">$</span> cat about.md
      </div>
      <div className="about-body section-gap">
        <p>
          Final-year Computer Networks student at{" "}
          <span style={{ color: "var(--accent)" }}>
            University of Information Technology (UIT), VNU-HCM
          </span>
          , pursuing a DevOps / Cloud Infrastructure career.
        </p>
        <p>
          Hands-on practice across the full DevOps lifecycle — from
          infrastructure provisioning and application deployment to monitoring,
          alerting, health checks, and rollback. Solid foundation in Computer
          Networks: TCP/IP, routing, load balancing and software-defined
          networking, applied directly to how I design cloud systems.
        </p>
        <p>
          Day-to-day toolkit:{" "}
          <span style={{ color: "var(--fg)", fontWeight: 500 }}>
            AWS, Kubernetes, Terraform, CI/CD, Prometheus/Grafana
          </span>{" "}
          monitoring and{" "}
          <span style={{ color: "var(--fg)", fontWeight: 500 }}>AI-Ops</span> —
          building AI agents that detect and analyze infrastructure incidents
          before they become outages.
        </p>
        <p>
          I build reliable cloud infrastructure, automate delivery, and explore
          AI-assisted operations. When I am not configuring pipelines, I am
          writing about DevOps workflows and cloud-native patterns.
        </p>
      </div>
      <div className="section-gap dimtext" style={{ fontSize: "12px" }}>
        <a
          href={`mailto:${site.email}`}
          style={{ color: "var(--dim)", textDecoration: "none" }}
        >
          {site.email}
        </a>
        {" · "}
        <a
          href={site.github}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "var(--dim)", textDecoration: "none" }}
        >
          github
        </a>
        {" · "}
        <a
          href={site.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "var(--dim)", textDecoration: "none" }}
        >
          linkedin
        </a>
      </div>
    </div>
  );
}
