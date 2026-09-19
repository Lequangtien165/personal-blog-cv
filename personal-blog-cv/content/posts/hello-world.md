---
title: "Từ những dòng lệnh đầu tiên đến hành trình DevOps của tôi"
date: "2026-06-13"
summary: "Vì sao tôi xây portfolio này và cách tôi biến từng project, lần triển khai và sự cố thành kinh nghiệm có thể kiểm chứng."
tags:
  - DevOps
  - Cloud
---

Mình là Lê Quang Tiến, sinh viên ngành Mạng máy tính tại UIT, VNU-HCM. Mình bắt đầu với những câu hỏi rất cơ bản: một dịch vụ chạy như thế nào, vì sao hệ thống mất kết nối, log đang nói điều gì và làm sao để biết bản sửa lỗi thực sự có hiệu quả. Càng tìm hiểu, mình càng hứng thú với DevOps, Cloud Infrastructure và Platform Engineering — nơi mỗi dòng cấu hình đều gắn với cách một hệ thống được xây dựng, vận hành và phục hồi.

## Vì sao mình xây website này?

Một bản CV có thể liệt kê AWS, Terraform, Kubernetes hay Prometheus, nhưng những cái tên đó chưa cho thấy mình đã sử dụng chúng để giải quyết vấn đề gì. Vì vậy, mình xây website này như một cuốn nhật ký kỹ thuật: nơi mỗi project không chỉ có kết quả cuối cùng mà còn có kiến trúc, cách triển khai, bước kiểm chứng, lỗi đã gặp và bài học rút ra.

## Mình đang xây dựng những gì?

Hành trình hiện tại của mình xoay quanh hạ tầng AWS, Infrastructure as Code, CI/CD, GitOps và observability. Mình đã thực hành provision hạ tầng bằng Terraform, cấu hình máy chủ với Ansible, triển khai workload trên EC2 và EKS, xây pipeline với GitHub Actions và Jenkins, đồng thời theo dõi hệ thống bằng Prometheus, Grafana và Alertmanager.

Các project trên portfolio ghi lại từng phần của hành trình đó: từ hệ thống phát hiện sự cố có AI hỗ trợ, nền tảng EKS vận hành theo GitOps, pipeline build–deploy Java trên AWS, đến bài lab cân bằng tải SDN bằng Ryu và Mininet. Mỗi project giúp mình hiểu thêm không chỉ cách làm cho hệ thống **chạy được**, mà còn cách kiểm tra, quan sát và xử lý khi nó **không chạy như mong đợi**.

## Mình sẽ viết như thế nào?

Mình không muốn dùng những cụm từ lớn như “production-ready” nếu chưa có đủ bằng chứng. Thay vào đó, mỗi bài viết sẽ cố gắng trả lời bốn câu hỏi:

1. Vấn đề cần giải quyết là gì?
2. Mình đã thiết kế và triển khai giải pháp như thế nào?
3. Mình kiểm chứng kết quả bằng log, metric, health check hoặc test ra sao?
4. Nếu làm lại, mình sẽ cải thiện điều gì?

Website này vì thế không phải nơi trưng bày một hành trình đã hoàn tất. Đây là nơi mình ghi lại quá trình học, xây dựng, làm sai, sửa lại và tiến bộ từng bước. Nếu một bài viết có thể giúp người đọc hiểu rõ hơn về một công cụ, tránh được một lỗi mình từng gặp, hoặc nhìn thấy cách mình tiếp cận vấn đề, thì bài viết đó đã hoàn thành mục tiêu của nó.

Đây là điểm bắt đầu. Những bài tiếp theo sẽ đi sâu hơn vào từng project, từng quyết định kỹ thuật và những bài học thực tế phía sau chúng.
