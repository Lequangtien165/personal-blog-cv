/**
 * HeroVisual — Animated CI/CD Pipeline Topology SVG
 * Shows the flow: GitHub → Jenkins → ECR / EKS
 * Pure SVG with SMIL animations, zero JS required.
 */
export function HeroVisual() {
  return (
    <div className="hero-visual" role="img" aria-label="Animated CI/CD pipeline: GitHub to Jenkins to ECR and EKS">
      <svg
        viewBox="0 0 340 290"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="pipeline-svg"
      >
        <defs>
          {/* Glow filters */}
          <filter id="glow-sm" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glow-lg" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Radial ambient glows per node */}
          <radialGradient id="glow-cyan-radial" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="glow-amber-radial" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="glow-purple-radial" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#a78bfa" stopOpacity="0" />
          </radialGradient>

          {/* Subtle grid pattern */}
          <pattern id="grid-dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="0.5" cy="0.5" r="0.5" fill="rgba(148,163,184,0.18)" />
          </pattern>

          {/* Connection paths (referenced by animateMotion) */}
          {/* GH → Jenkins */}
          <path id="p-gh-jen" d="M 170 68 L 170 100" />
          {/* Jenkins → ECR */}
          <path id="p-jen-ecr" d="M 152 150 L 101 208" />
          {/* Jenkins → EKS */}
          <path id="p-jen-eks" d="M 188 150 L 239 208" />
          {/* ECR → EKS */}
          <path id="p-ecr-eks" d="M 109 232 L 231 232" />
        </defs>

        {/* ── Background ────────────────────────────────── */}
        <rect width="340" height="290" fill="url(#grid-dots)" rx="16" opacity="0.6" />

        {/* ── Ambient glow halos ────────────────────────── */}
        <ellipse cx="170" cy="38" rx="60" ry="60" fill="url(#glow-cyan-radial)" />
        <ellipse cx="170" cy="128" rx="70" ry="70" fill="url(#glow-cyan-radial)">
          <animate attributeName="rx" values="60;80;60" dur="3s" repeatCount="indefinite" />
          <animate attributeName="ry" values="60;80;60" dur="3s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="1;0.6;1" dur="3s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="90" cy="232" rx="50" ry="50" fill="url(#glow-amber-radial)" />
        <ellipse cx="250" cy="232" rx="50" ry="50" fill="url(#glow-purple-radial)" />

        {/* ── Edge lines ────────────────────────────────── */}
        {/* GH → Jenkins */}
        <path
          d="M 170 68 L 170 100"
          stroke="#22d3ee"
          strokeWidth="1.5"
          strokeDasharray="5 4"
          opacity="0.35"
        />
        {/* Jenkins → ECR */}
        <path
          d="M 152 150 L 101 208"
          stroke="#f59e0b"
          strokeWidth="1.5"
          strokeDasharray="5 4"
          opacity="0.35"
        />
        {/* Jenkins → EKS */}
        <path
          d="M 188 150 L 239 208"
          stroke="#a78bfa"
          strokeWidth="1.5"
          strokeDasharray="5 4"
          opacity="0.35"
        />
        {/* ECR → EKS */}
        <path
          d="M 109 232 L 231 232"
          stroke="#22d3ee"
          strokeWidth="1.5"
          strokeDasharray="5 4"
          opacity="0.2"
        />

        {/* ── Animated packets ──────────────────────────── */}
        {/* Packet: GH → Jenkins (cyan) */}
        <circle r="4.5" fill="#22d3ee" filter="url(#glow-sm)">
          <animateMotion dur="1.8s" repeatCount="indefinite" begin="0s" calcMode="linear">
            <mpath href="#p-gh-jen" />
          </animateMotion>
          <animate attributeName="opacity" values="0;1;1;0" dur="1.8s" repeatCount="indefinite" begin="0s" />
        </circle>
        {/* Packet 2: GH → Jenkins (cyan, offset) */}
        <circle r="3" fill="#67e8f9" filter="url(#glow-sm)" opacity="0.7">
          <animateMotion dur="1.8s" repeatCount="indefinite" begin="0.9s" calcMode="linear">
            <mpath href="#p-gh-jen" />
          </animateMotion>
          <animate attributeName="opacity" values="0;0.7;0.7;0" dur="1.8s" repeatCount="indefinite" begin="0.9s" />
        </circle>

        {/* Packet: Jenkins → ECR (amber) */}
        <circle r="4" fill="#f59e0b" filter="url(#glow-sm)">
          <animateMotion dur="2.2s" repeatCount="indefinite" begin="0.6s" calcMode="linear">
            <mpath href="#p-jen-ecr" />
          </animateMotion>
          <animate attributeName="opacity" values="0;1;1;0" dur="2.2s" repeatCount="indefinite" begin="0.6s" />
        </circle>

        {/* Packet: Jenkins → EKS (purple) */}
        <circle r="4" fill="#a78bfa" filter="url(#glow-sm)">
          <animateMotion dur="2.2s" repeatCount="indefinite" begin="1.4s" calcMode="linear">
            <mpath href="#p-jen-eks" />
          </animateMotion>
          <animate attributeName="opacity" values="0;1;1;0" dur="2.2s" repeatCount="indefinite" begin="1.4s" />
        </circle>

        {/* Packet: ECR → EKS (cyan dim) */}
        <circle r="3" fill="#22d3ee" filter="url(#glow-sm)" opacity="0.6">
          <animateMotion dur="2.8s" repeatCount="indefinite" begin="2s" calcMode="linear">
            <mpath href="#p-ecr-eks" />
          </animateMotion>
          <animate attributeName="opacity" values="0;0.6;0.6;0" dur="2.8s" repeatCount="indefinite" begin="2s" />
        </circle>

        {/* ── Jenkins sonar ring ────────────────────────── */}
        <circle cx="170" cy="128" r="28" fill="none" stroke="#22d3ee" strokeWidth="1" opacity="0">
          <animate attributeName="r" from="28" to="52" dur="2.4s" repeatCount="indefinite" begin="0.5s" />
          <animate attributeName="opacity" values="0.5;0" dur="2.4s" repeatCount="indefinite" begin="0.5s" />
        </circle>

        {/* ── Nodes ─────────────────────────────────────── */}
        {/* GitHub node */}
        <g className="svg-node">
          <circle cx="170" cy="38" r="28" fill="#060b18" stroke="#22d3ee" strokeWidth="1.5" filter="url(#glow-sm)" />
          {/* GitHub logo simplified */}
          <path
            d="M 170 28 C 163.4 28 158 33.4 158 40 C 158 45.3 161.3 49.8 166 51.4 C 166.6 51.5 166.8 51.1 166.8 50.8 C 166.8 50.5 166.8 49.6 166.8 48.5 C 163.5 49.2 162.8 46.9 162.8 46.9 C 162.3 45.6 161.5 45.2 161.5 45.2 C 160.4 44.5 161.6 44.5 161.6 44.5 C 162.8 44.6 163.5 45.8 163.5 45.8 C 164.6 47.6 166.3 47.1 166.9 46.8 C 167 46 167.3 45.5 167.6 45.2 C 165.1 44.9 162.4 43.9 162.4 39.5 C 162.4 38.3 162.8 37.3 163.5 36.5 C 163.4 36.2 163 35 163.6 33.4 C 163.6 33.4 164.6 33.1 166.8 34.6 C 167.7 34.4 168.7 34.2 169.7 34.2 C 170.7 34.2 171.7 34.3 172.6 34.6 C 174.8 33.1 175.8 33.4 175.8 33.4 C 176.4 35 176 36.2 175.9 36.5 C 176.6 37.3 177 38.3 177 39.5 C 177 43.9 174.3 44.9 171.8 45.2 C 172.2 45.6 172.6 46.4 172.6 47.6 C 172.6 49.4 172.6 50.8 172.6 51.3 C 172.6 51.6 172.8 52 173.4 51.9 C 178.1 50.3 181.4 45.8 181.4 40.5 C 181.4 33.9 176 28 170 28 Z"
            fill="#22d3ee"
            opacity="0.9"
          />
        </g>

        {/* Jenkins (CI/CD hub) */}
        <g className="svg-node">
          <circle cx="170" cy="128" r="28" fill="#060b18" stroke="#22d3ee" strokeWidth="2" filter="url(#glow-lg)" />
          <text x="170" y="123" textAnchor="middle" fill="#22d3ee" fontSize="8.5" fontWeight="700" fontFamily="monospace" letterSpacing="0.5">CI/CD</text>
          <text x="170" y="134" textAnchor="middle" fill="#22d3ee" fontSize="8.5" fontWeight="700" fontFamily="monospace" letterSpacing="0.5">JENKINS</text>
        </g>

        {/* ECR */}
        <g className="svg-node">
          <circle cx="90" cy="232" r="24" fill="#060b18" stroke="#f59e0b" strokeWidth="1.5" filter="url(#glow-sm)" />
          <text x="90" y="237" textAnchor="middle" fill="#f59e0b" fontSize="10" fontWeight="700" fontFamily="monospace">ECR</text>
        </g>

        {/* EKS */}
        <g className="svg-node">
          <circle cx="250" cy="232" r="24" fill="#060b18" stroke="#a78bfa" strokeWidth="1.5" filter="url(#glow-sm)" />
          <text x="250" y="237" textAnchor="middle" fill="#a78bfa" fontSize="10" fontWeight="700" fontFamily="monospace">EKS</text>
        </g>

        {/* ── Node labels ───────────────────────────────── */}
        <text x="170" y="79" textAnchor="middle" fill="rgba(148,163,184,0.65)" fontSize="10" fontFamily="monospace">GitHub</text>
        <text x="170" y="169" textAnchor="middle" fill="rgba(148,163,184,0.65)" fontSize="10" fontFamily="monospace">Pipeline</text>
        <text x="90" y="267" textAnchor="middle" fill="rgba(148,163,184,0.65)" fontSize="9.5" fontFamily="monospace">Registry</text>
        <text x="250" y="267" textAnchor="middle" fill="rgba(148,163,184,0.65)" fontSize="9.5" fontFamily="monospace">Kubernetes</text>

        {/* ── Corner badge: LIVE ────────────────────────── */}
        <g transform="translate(270, 18)">
          <rect x="0" y="0" width="52" height="18" rx="9" fill="rgba(34,197,94,0.12)" stroke="rgba(34,197,94,0.3)" strokeWidth="1" />
          <circle cx="12" cy="9" r="3.5" fill="#22c55e">
            <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite" />
          </circle>
          <text x="28" y="13.5" textAnchor="middle" fill="#22c55e" fontSize="8" fontWeight="700" fontFamily="monospace">LIVE</text>
        </g>
      </svg>
    </div>
  );
}
