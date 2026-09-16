export const site = {
  systemName: "QT-OS",
  systemVersion: "v1.0.0",
  moduleName: "PORTFOLIO",
  name: "Lê Quang Tiến",
  nameUpper: "LE QUANG TIEN",
  role: "DevOps / Cloud Engineer",
  tagline:
    "I automate AWS infrastructure and delivery workflows, with a systems and networking foundation.",
  location: "Ho Chi Minh City, Vietnam",
  locationShort: "HCM -- VN",
  locationUpper: "HO CHI MINH CITY",
  focus: "AWS · Terraform · Kubernetes · CI/CD · Observability",
  status: "AVAILABLE FOR OPPORTUNITIES",
  email: "qtienle16@gmail.com",
  github: "https://github.com/Lequangtien165",
  linkedin: "https://www.linkedin.com/in/qtienle16/",
  node: "quangtien.id.vn",
  promptUser: "qt",
  promptHost: "portfolio",
} as const;

export const promptText = `${site.promptUser}@${site.promptHost}:~$`;
