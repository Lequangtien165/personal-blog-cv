---
title: "DevOps Foundations #1: Bản chất CI/CD — từ một commit đến production"
date: "2026-09-20"
summary: "Hiểu CI/CD như một hệ thống phản hồi và kiểm soát rủi ro, không phải một file YAML hay nút Deploy tự động."
tags:
  - CI/CD
  - DevOps Foundations
  - Delivery
---

> Đây là bài 1/12 của series **DevOps Foundations**. Mục tiêu của series là đi từ bản chất, cơ chế hoạt động đến cách kiểm chứng bằng thực hành.

Một pipeline hiện màu xanh chưa chứng minh phần mềm đang phục vụ người dùng đúng cách. Nó chỉ chứng minh những bước đã được khai báo trong pipeline đã chạy thành công. Muốn hiểu CI/CD, ta phải bắt đầu từ vấn đề mà nó giải quyết: **làm sao đưa một thay đổi nhỏ đến môi trường thật nhanh, lặp lại được, có bằng chứng và có đường lui khi sai**.

## CI/CD thực sự là gì?

**Continuous Integration (CI)** là thói quen tích hợp thay đổi nhỏ vào nhánh chung thường xuyên. Mỗi thay đổi được máy kiểm tra sớm để lỗi không tích tụ thành một đợt tích hợp lớn.

**Continuous Delivery** nghĩa là sau CI, hệ thống luôn tạo ra một phiên bản đủ điều kiện để triển khai. Production vẫn có thể cần phê duyệt.

**Continuous Deployment** đi xa hơn: thay đổi vượt qua toàn bộ policy sẽ tự động đến production. Không có nghĩa là bỏ kiểm soát; kiểm soát được chuyển thành test, policy, quan sát và rollback tự động.

Ba khái niệm này tạo thành một **feedback loop**:

```text
thay đổi nhỏ -> kiểm tra sớm -> artifact xác định -> triển khai có kiểm soát
      ^                                                  |
      |---------- log, metric, test, phản hồi ------------|
```

Tốc độ chỉ là kết quả phụ. Giá trị cốt lõi là giảm thời gian từ lúc tạo lỗi đến lúc nhận ra lỗi và thu nhỏ phạm vi của mỗi sự cố.

## Luồng từ commit đến release

Một luồng delivery đủ ý nghĩa thường có các chặng sau:

1. Developer tạo thay đổi nhỏ và pull request.
2. CI kiểm tra format, lint, type, unit test và các policy bắt buộc.
3. Hệ thống build artifact đúng một lần.
4. Artifact được gắn với commit SHA hoặc digest bất biến.
5. Artifact đó được promote qua test, staging rồi production; không build lại ở từng môi trường.
6. Deployment được kiểm tra bằng readiness, smoke test, error rate và latency.
7. Nếu tiêu chí thất bại, hệ thống dừng rollout hoặc rollback.

Điểm quan trọng là bước 6. `kubectl apply` trả về mã thoát `0` chỉ nói API đã chấp nhận yêu cầu. Nó chưa nói Pod đã sẵn sàng, dependency đã kết nối được hay người dùng nhận đúng kết quả.

## Source, artifact, release và deployment khác nhau thế nào?

- **Source** là code và cấu hình được quản lý trong Git.
- **Artifact** là đầu ra đã build: container image, binary, package hoặc bundle.
- **Release** là một artifact cụ thể cộng với cấu hình, migration và ghi chú cần thiết để đưa nó vào một môi trường.
- **Deployment** là hành động làm cho release đó chạy trong môi trường đích.

Nếu cùng một commit được build lại ba lần cho ba môi trường, ta thực tế có ba artifact khác nhau dù tên version giống nhau. Dependency hoặc base image có thể đã thay đổi. Nguyên tắc an toàn hơn là **build once, promote the same artifact**.

## Pipeline, job và step

Trong đa số nền tảng CI/CD:

- **Pipeline/workflow** mô tả toàn bộ luồng.
- **Job** là một đơn vị chạy trên một runner; các job có thể phụ thuộc hoặc chạy song song.
- **Step** là thao tác tuần tự trong một job.
- **Runner/agent** là máy thực thi job.
- **Trigger** là sự kiện khởi chạy: pull request, push, tag, lịch hoặc thao tác thủ công.

Ví dụ tư duy, không phụ thuộc một nền tảng cụ thể:

```yaml
on: pull_request

jobs:
  verify:
    steps:
      - checkout
      - install-dependencies-from-lockfile
      - lint
      - unit-test
      - build
      - publish-test-report
```

Một pipeline tốt phải cho biết **điều gì được kiểm tra**, **bằng chứng nằm ở đâu** và **điều kiện nào chặn thay đổi**. Tên step `quality-check` nhưng chỉ chạy `echo ok` không tạo ra kiểm soát nào.

## Vì sao thay đổi nhỏ an toàn hơn?

Giả sử một release chứa 30 thay đổi và phát sinh lỗi. Phạm vi điều tra gồm cả 30. Nếu mỗi release chỉ có một hoặc vài thay đổi, ta có ít giả thuyết hơn, review dễ hơn và rollback ít kéo lùi chức năng tốt.

CI/CD vì vậy gắn với:

- branch tồn tại ngắn;
- pull request nhỏ;
- test nhanh ở đầu pipeline;
- feedback rõ ràng;
- release thường xuyên với batch nhỏ.

Đây cũng là lý do pipeline nên **fail fast**. Kiểm tra rẻ và nhanh chạy trước; test tích hợp tốn thời gian và quét sâu chạy sau. Fail fast không phải bỏ test, mà là sắp xếp feedback có chủ đích.

## Điều gì không phải CI/CD?

- Một script copy file qua SSH chưa tự động trở thành CD.
- Jenkins hoặc GitHub Actions chỉ là công cụ thực thi, không phải chiến lược delivery.
- Tự động deploy nhưng không có health verification là tự động hóa rủi ro.
- Có nhiều stage không đồng nghĩa pipeline đáng tin nếu test không kiểm tra hành vi thật.
- Một pipeline chỉ chạy trên nhánh chính không cung cấp feedback sớm cho pull request.

## Cách đọc một pipeline bất kỳ

Khi gặp một file pipeline lạ, hãy hỏi theo thứ tự:

1. Sự kiện nào kích hoạt nó?
2. Code nào đang được chạy và runner có quyền gì?
3. Dependency có bị khóa version không?
4. Test nào là gate bắt buộc?
5. Artifact nào được tạo, định danh và lưu ở đâu?
6. Môi trường nào nhận artifact đó?
7. Secret được cấp lúc nào và trong phạm vi nào?
8. Sau deploy, hệ thống kiểm chứng điều gì?
9. Khi thất bại, ai dừng rollout và rollback bằng cách nào?

Trả lời được chín câu này quan trọng hơn ghi nhớ cú pháp của một nền tảng.

## Bài thực hành

Chọn một project nhỏ và vẽ luồng hiện tại từ commit đến lúc chạy. Với từng bước, ghi:

- input;
- output;
- điều kiện thành công;
- bằng chứng được giữ lại;
- cách phục hồi nếu bước đó thất bại.

Nếu một ô chỉ có câu “chạy deploy”, hãy tách nó tiếp cho đến khi thấy artifact, môi trường, health check và rollback.

## Chốt lại

CI/CD là một hệ thống tạo feedback và quản lý rủi ro thay đổi. Nền tảng tốt nhất không cứu được quy trình thiếu artifact bất biến, tiêu chí sức khỏe hay đường rollback. Hãy nhìn pipeline như một chuỗi bằng chứng: **đây là code đã review, đây là test đã chạy, đây là artifact đã build, đây là môi trường đã nhận nó và đây là tín hiệu chứng minh release đang khỏe**.

**Bài tiếp theo:** [DevOps Foundations #2: CI đáng tin cậy — test, artifact và supply chain](/blog/devops-foundations-02-ci-dang-tin-cay)

---

Nguồn chính thức:

- [GitHub Actions - Understanding workflows](https://docs.github.com/en/actions/about-github-actions/understanding-github-actions)
- [GitHub Actions - Secure use reference](https://docs.github.com/en/actions/reference/security/secure-use)
- [Artifact attestations](https://docs.github.com/en/actions/concepts/security/artifact-attestations)
