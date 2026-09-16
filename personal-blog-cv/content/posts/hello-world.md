---
title: "Tôi đang xây blog này như một DevOps portfolio"
date: "2026-06-13"
summary: "Ghi lại cách tôi biến CV, GitHub và các lab Cloud/DevOps thành bằng chứng portfolio rõ ràng hơn."
tags:
  - DevOps
  - Cloud
---

# Tôi đang xây blog này như một DevOps portfolio

Mình là Lê Quang Tiến, sinh viên Computer Networks tại UIT, VNU-HCM, đang theo hướng DevOps, Cloud Infrastructure và Platform Engineering. Blog này không chỉ là nơi giới thiệu bản thân, mà là một phần của portfolio: mỗi bài viết nên trả lời được mình đã xây gì, kiểm chứng ra sao, và phần nào thật sự do mình thực hiện.

Hiện tại trọng tâm của mình là AWS, Terraform, Kubernetes/EKS, GitHub Actions, Argo CD, Prometheus/Grafana, Alertmanager, Ansible và AI-assisted incident analysis. Các dự án chính gồm hệ thống AIOps trên AWS, nền tảng EKS GitOps, bài lab cân bằng tải SDN với Ryu/Mininet và quy trình build-deploy Java bằng Jenkins, Maven, Docker trên EC2.

Mục tiêu của website này là đối chiếu thẳng với CV và GitHub: CV nói về kỹ năng nào thì website phải có dự án hoặc ghi chú kỹ thuật đi kèm; GitHub có repo nào thì nội dung blog phải giải thích được kiến trúc, pipeline, health check, rollback, monitoring hoặc bài học vận hành phía sau.

Một thay đổi nhỏ nhưng quan trọng: mình sẽ ưu tiên cách viết có bằng chứng hơn là khẩu hiệu. Thay vì nói “production-ready” một cách chung chung, mình sẽ mô tả cụ thể các phần như Terraform provision, image build, Trivy scan, deploy lên EKS/EC2, Prometheus alert, Telegram notification, và rollback khi health check thất bại.

```bash
npm ci
npm run typecheck
npm run build
```
