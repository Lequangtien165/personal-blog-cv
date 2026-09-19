export function CvSection() {
  return (
    <div id="page-resume">
      <div>
        <span className="cmd-prompt">$</span> cat resume.txt
      </div>
      <div className="cs-body section-gap">
        <div className="cs-section-title">// work experience</div>

        <div className="exp-block">
          <div className="exp-company">DTP Education Solutions</div>
          <div className="exp-meta">
            <span className="exp-dates">Jul 2026 -- Sep 2026</span>
            <span className="exp-role">System Administrator Intern</span>
          </div>
          <div className="exp-bullet">
            Practiced Linux and Windows server administration in a VMware ESXi
            environment, including VM provisioning, snapshots, backup, and
            recovery procedures.
          </div>
          <div className="exp-bullet">
            Supported system and network troubleshooting with connectivity
            tests, service checks, logs, DNS checks, metrics, alerts, firewall
            rules, routers, switches, and end devices.
          </div>
          <div className="exp-bullet">
            Practiced monitoring with Grafana, Windows Exporter, Linux Exporter,
            Node Exporter, and Bash scripts.
          </div>
        </div>

        <div className="cs-section-title">// projects</div>

        <div className="exp-block">
          <div className="exp-company">
            Cloud-Based AI Agent Network Incident Detection
          </div>
          <div className="exp-meta">
            <span className="exp-dates">Jan 2026 -- Jun 2026</span>
            <span className="exp-role">DevOps / Cloud Engineer / AI Engineer</span>
          </div>
          <div className="exp-bullet">
            Provisioned AWS infrastructure with Terraform and automated Linux
            server bootstrap with Ansible.
          </div>
          <div className="exp-bullet">
            Built an alert workflow where Prometheus and Blackbox Exporter
            detected failures, Alertmanager triggered webhooks, and Telegram
            received operational notifications.
          </div>
          <div className="exp-bullet">
            Developed asynchronous incident analysis with FastAPI, Gemini, RAG,
            Celery, and Redis.
          </div>
        </div>

        <div className="exp-block">
          <div className="exp-company">
            EKS GitOps Platform on AWS
          </div>
          <div className="exp-meta">
            <span className="exp-dates">Jul 2026 -- Present</span>
            <span className="exp-role">DevOps / Cloud Engineer</span>
          </div>
          <div className="exp-bullet">
            Provisioned an AWS EKS platform with Terraform, including VPC,
            subnets, NAT Gateway, IAM roles, ECR, and managed node groups.
          </div>
          <div className="exp-bullet">
            Built GitOps deployment workflow with Argo CD and Helm for separate
            development and production Kubernetes environments.
          </div>
          <div className="exp-bullet">
            Added GitHub Actions pipelines with tests, container image builds,
            Trivy scans, and Amazon ECR publishing.
          </div>
        </div>

        <div className="exp-block">
          <div className="exp-company">
            End-to-End CI/CD Pipeline on AWS with Jenkins & Docker
          </div>
          <div className="exp-meta">
            <span className="exp-dates">2026</span>
            <span className="exp-role">DevOps Lab</span>
          </div>
          <div className="exp-bullet">
            Built a Java web application with Maven on a Jenkins EC2 server and
            transferred the WAR artifact to a separate Docker host.
          </div>
          <div className="exp-bullet">
            Automated container replacement through Publish Over SSH, Docker,
            Tomcat, and a Jenkins build triggered by source polling.
          </div>
        </div>

        <div className="cs-section-title">// education</div>
        <div className="exp-block">
          <div className="exp-company">
            University of Information Technology (UIT), VNU-HCM
          </div>
          <div className="exp-meta">
            <span className="exp-dates">Expected Jul 2027</span>
            <span className="exp-role">
              B.Eng. Computer Networks & Data Communication
            </span>
          </div>
          <div className="exp-bullet">
            GPA 8.5/10 · IELTS Academic 6.5
          </div>
          <div className="exp-bullet">
            Certified: AWS Cloud Practitioner (CLF-C02) · Google System
            Administration and IT Infrastructure Services
          </div>
        </div>

        <div className="cs-section-title">// skills</div>
        <div className="skills-grid">
          <span className="skill-cat">CLOUD</span>
          <span>AWS · EC2 · EKS · ECR · IAM · VPC · NAT Gateway</span>
          <span className="skill-cat">ORCH</span>
          <span>Docker · Docker Compose · Kubernetes · Helm · ingress-nginx</span>
          <span className="skill-cat">AUTOMATION</span>
          <span>Terraform · Ansible · GitHub Actions · Argo CD · Jenkins</span>
          <span className="skill-cat">OBSERVE</span>
          <span>Prometheus · Grafana · Alertmanager · Blackbox Exporter</span>
          <span className="skill-cat">AI OPS</span>
          <span>FastAPI · Gemini · RAG · Celery · Redis</span>
          <span className="skill-cat">SYSTEMS</span>
          <span>Linux · Windows Server · VMware ESXi · Bash · Python</span>
          <span className="skill-cat">NETWORK</span>
          <span>TCP/IP · DNS · routing · firewalls · security groups</span>
          <span className="skill-cat">LANGUAGES</span>
          <span>Vietnamese (native) · English (IELTS 6.5)</span>
        </div>
      </div>
    </div>
  );
}
