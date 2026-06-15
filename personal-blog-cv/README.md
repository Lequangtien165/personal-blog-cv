# Personal Blog CV App

Next.js app for a personal blog and CV. Blog posts and CV content are stored as Markdown files under `content/`.

## Commands

```bash
npm ci
npm run lint
npm run typecheck
npm run build
npm run dev
```

## Docker

Build:

```bash
docker build -t blog-cv:local .
```

Run:

```bash
docker run --rm -p 3000:3000 blog-cv:local
```

Open:

```text
http://localhost:3000
```

## CI/CD

The `Jenkinsfile` runs:

1. Install dependencies
2. Lint
3. Typecheck
4. Next.js build
5. Semgrep scan
6. Trivy filesystem scan
7. Docker build
8. Trivy image scan
9. Push image to AWS ECR
10. Deploy to AWS EKS

The Jenkinsfile resolves the full ECR URL automatically from the Jenkins EC2 IAM role and the repository name `blog-cv-app`.
