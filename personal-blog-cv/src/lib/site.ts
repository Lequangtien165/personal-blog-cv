export const site = {
  systemName: "QT-OS",
  systemVersion: "v1.0.0",
  moduleName: "PORTFOLIO",
  name: "Lê Quang Tiến",
  nameUpper: "LE QUANG TIEN",
  role: "DevOps / Cloud Infrastructure Engineer",
  tagline:
    "I build reliable cloud infrastructure, automate delivery, and explore AI-assisted operations.",
  location: "Ho Chi Minh City, Vietnam",
  locationShort: "HCM -- VN",
  locationUpper: "HO CHI MINH CITY",
  focus: "AWS · Kubernetes · Terraform · CI/CD · AI-Ops",
  status: "AVAILABLE FOR OPPORTUNITIES",
  email: "qtienle16@gmail.com",
  github: "https://github.com/Lequangtien165",
  linkedin: "https://www.linkedin.com/in/qtienle16/",
  node: "quangtien.id.vn",
  promptUser: "qt",
  promptHost: "portfolio",
} as const;

export const promptText = `${site.promptUser}@${site.promptHost}:~$`;
