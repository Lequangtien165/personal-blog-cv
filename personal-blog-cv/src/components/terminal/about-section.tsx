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
          , targeting System Engineer intern or junior roles focused on
          reliable infrastructure operations.
        </p>
        <p>
          During my System Administrator internship, I supported Linux and
          Windows server operations in VMware ESXi, including VM provisioning,
          snapshots, backup and recovery procedures, monitoring, and
          troubleshooting.
        </p>
        <p>
          My projects extend that foundation with AWS infrastructure, Terraform
          and Ansible automation, container platforms, network services, and
          monitoring with Prometheus, Grafana, and Alertmanager.
        </p>
        <p>
          Current toolkit:{" "}
          <span style={{ color: "var(--fg)", fontWeight: 500 }}>
            Linux, Windows Server, VMware ESXi, Bash, Ansible, AWS, Terraform,
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
          came from internship operations or independent project work.
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
