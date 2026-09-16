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
          , pursuing DevOps, Cloud Infrastructure, and Platform Engineering
          intern or junior roles.
        </p>
        <p>
          My strongest work is practical: AWS infrastructure with Terraform,
          server bootstrap with Ansible, Docker/Kubernetes deployments,
          GitHub Actions pipelines, health checks, rollback, and observability
          with Prometheus, Grafana, Alertmanager, Blackbox Exporter, and Node
          Exporter.
        </p>
        <p>
          My System Administrator internship added practical exposure to VMware
          ESXi, VM provisioning, snapshots, backup and recovery procedures,
          service checks, DNS/connectivity troubleshooting, firewall rules, and
          monitoring exporters across Linux and Windows servers.
        </p>
        <p>
          Current toolkit:{" "}
          <span style={{ color: "var(--fg)", fontWeight: 500 }}>
            AWS, EKS, Terraform, Kubernetes, GitHub Actions, Argo CD,
            Prometheus/Grafana
          </span>{" "}
          and{" "}
          <span style={{ color: "var(--fg)", fontWeight: 500 }}>
            AI-assisted incident analysis
          </span>
          .
        </p>
        <p>
          This site documents what I built, how I validated it, and which parts
          were project work, internship practice, or operational evidence.
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
