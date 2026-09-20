---
title: "DevOps Foundations #2: CI đáng tin cậy — test, artifact và software supply chain"
date: "2026-09-20"
summary: "Thiết kế CI để tạo feedback nhanh, artifact tái lập được và bằng chứng đủ mạnh trước khi một thay đổi được phép đi tiếp."
tags:
  - CI/CD
  - DevOps Foundations
  - DevSecOps
---

> Bài 2/12. Nên đọc trước: [Bản chất CI/CD](/blog/devops-foundations-01-ban-chat-cicd).

CI có hai đầu ra. Đầu ra dễ thấy là file build hoặc container image. Đầu ra quan trọng hơn là **mức độ tin cậy**: ta biết gì về thay đổi này, đã kiểm tra tới đâu và còn rủi ro nào chưa được bao phủ?

## Thứ tự kiểm tra từ nhanh đến sâu

Không nên gom mọi thứ vào một lệnh `test-all`. Hãy chia feedback thành các lớp:

1. **Static checks:** format, lint, type checking, policy và phát hiện secret.
2. **Unit tests:** kiểm tra logic nhỏ, nhanh và cô lập.
3. **Component/integration tests:** kiểm tra database, queue, API hoặc nhiều module phối hợp.
4. **Contract tests:** xác minh producer và consumer vẫn hiểu cùng một giao diện.
5. **End-to-end tests:** kiểm tra một hành trình người dùng quan trọng trên hệ thống gần thật.
6. **Security checks:** dependency, source, image, IaC và license theo policy.

Nhiều test end-to-end không bù được unit test kém. E2E chậm, dễ flake và khi hỏng thường khó chỉ ra nguyên nhân. Mô hình tốt là nhiều test nhỏ ở dưới, ít test xuyên suốt nhưng có giá trị cao ở trên.

## Test phải thất bại đúng lý do

Một test chỉ hữu ích khi:

- lặp lại được;
- cô lập đủ để không phụ thuộc dữ liệu ngẫu nhiên;
- có thông báo lỗi chỉ tới hành vi bị sai;
- thất bại làm pipeline dừng;
- kết quả và log được lưu làm bằng chứng.

Không nên dùng `continue-on-error` cho một gate bắt buộc chỉ để pipeline xanh. Nếu một test chưa ổn định, hãy sửa, cô lập hoặc tạm loại khỏi gate với issue và thời hạn rõ ràng. Che lỗi biến màu xanh thành tín hiệu giả.

## Reproducible build bắt đầu từ dependency

Nếu hôm nay và ngày mai cùng build một commit nhưng nhận hai đầu ra khác nhau, ta khó điều tra và khó tin artifact. Các điều kiện nền tảng gồm:

- commit lockfile;
- dùng lệnh cài đặt tôn trọng lockfile, ví dụ `npm ci`;
- pin base image bằng digest khi yêu cầu kiểm soát cao;
- ghi lại compiler/runtime version;
- không tải script tùy ý rồi thực thi mà không xác minh;
- giữ build context nhỏ và rõ ràng.

Container tag có thể thay đổi nội dung; digest thì định danh nội dung cụ thể:

```text
registry.example/app:1.4.0
registry.example/app@sha256:4f...ab
```

Tag thuận tiện cho con người. Digest phù hợp để chứng minh chính xác image nào được triển khai.

## Build một lần, promote nhiều lần

Luồng an toàn hơn:

```text
commit abc123
   -> test
   -> build image
   -> scan
   -> ký/attest
   -> push registry với digest D
   -> deploy digest D vào staging
   -> promote chính digest D vào production
```

Không build lại image ở stage production. Nếu build lại, đầu vào ngoài Git có thể đổi và bằng chứng ở staging không còn áp dụng cho artifact production.

## Cache tăng tốc nhưng không được thay thế tính đúng

Cache dependency hoặc build layer giảm thời gian pipeline. Tuy nhiên cache key quá rộng có thể tái sử dụng dữ liệu cũ. Cache key nên gắn với:

- hệ điều hành và kiến trúc;
- runtime/toolchain version;
- dependency lockfile;
- phần cấu hình ảnh hưởng build.

Luôn giả định cache có thể mất. Một build sạch vẫn phải chạy được. Cache là tối ưu hiệu năng, không phải nguồn chân lý.

## Software supply chain là chuỗi niềm tin

Pipeline chạy code từ repository, action/plugin, package manager, base image và build tool. Mỗi thành phần có thể trở thành điểm xâm nhập. Kiểm soát tối thiểu gồm:

- giới hạn quyền token theo least privilege;
- pin action/plugin tới full commit SHA khi cần tính bất biến;
- không đưa secret vào job chạy code không tin cậy;
- quét secret trước khi merge;
- tạo SBOM để biết artifact chứa dependency nào;
- tạo provenance/attestation để liên hệ artifact với workflow và commit;
- ký hoặc xác minh artifact trước deploy;
- tách quyền build khỏi quyền production.

SBOM là danh mục thành phần, không phải giấy chứng nhận an toàn. Scanner không tìm thấy CVE cũng không chứng minh code không có lỗ hổng. Các công cụ này cung cấp bằng chứng cho quyết định policy, không thay thế threat modeling và review.

## Pull request từ nguồn không tin cậy

Code trong pull request có thể cố đọc token, sửa build script hoặc exfiltrate cache. Vì vậy job kiểm tra PR nên có quyền đọc tối thiểu và không nhận secret production. Hãy đặc biệt thận trọng với trigger có quyền cao nhưng lại checkout code của contributor.

Mental model cần nhớ:

```text
untrusted input + privileged runner/secret = đường tấn công
```

Đừng chỉ review application code. Workflow, Dockerfile, dependency script và IaC cũng là code có khả năng thực thi hoặc thay đổi hạ tầng.

## Artifact cần những metadata nào?

Một artifact hữu ích cho điều tra nên truy được:

- commit SHA;
- thời điểm và workflow build;
- toolchain version;
- dependency/SBOM;
- test và scan result;
- digest;
- chữ ký hoặc attestation nếu áp dụng.

Khi có incident, câu hỏi “production đang chạy gì?” phải trả lời bằng digest và deployment record, không phải “chắc là nhánh main mới nhất”.

## Quality gate nên dựa trên rủi ro

Không phải mọi cảnh báo đều phải chặn release. Policy cần nói rõ:

- loại lỗi nào bắt buộc dừng;
- exception do ai phê duyệt;
- exception hết hạn khi nào;
- bằng chứng nào được lưu;
- ai chịu trách nhiệm sửa.

Ví dụ: secret thật trong Git phải chặn ngay; CVE chưa có đường khai thác có thể cần đánh giá; lint về style có thể chỉ cảnh báo. Một gate không có quy trình exception sẽ bị vô hiệu hóa khi gặp áp lực release.

## Checklist chẩn đoán CI

Khi CI thất bại, đi từ tín hiệu gần nhất:

1. Xác định job và step thất bại đầu tiên, không bị phân tâm bởi lỗi dây chuyền.
2. So sánh runtime, biến môi trường và lockfile với máy local.
3. Chạy lại không cache nếu nghi dữ liệu cũ.
4. Kiểm tra test có phụ thuộc thời gian, mạng hoặc thứ tự không.
5. Xem artifact/log có được tạo đủ để tái hiện không.
6. Không retry vô hạn; retry chỉ hợp lý cho lỗi tạm thời đã được phân loại.

## Bài thực hành

Với một repository nhỏ, hãy tạo bảng bằng chứng gồm: check, mục tiêu, thời gian chạy, điều kiện fail và output được lưu. Sau đó thực hiện ba thí nghiệm:

1. sửa code để unit test thất bại;
2. sửa lockfile hoặc dependency để build thất bại có chủ đích;
3. xóa cache và chứng minh build sạch vẫn thành công.

Mục tiêu không phải chỉ làm pipeline xanh, mà chứng minh nó chuyển đỏ đúng lúc.

## Chốt lại

CI đáng tin không được đo bằng số lượng tool. Nó được đo bằng khả năng tạo feedback sớm, tái lập artifact và lưu đủ provenance để trả lời: artifact này đến từ đâu, đã qua kiểm tra gì và vì sao được phép đi tiếp.

**Bài tiếp theo:** [DevOps Foundations #3: CD, deployment strategy và rollback](/blog/devops-foundations-03-cd-va-rollback)

---

Nguồn chính thức:

- [GitHub Actions - Secure use reference](https://docs.github.com/en/actions/reference/security/secure-use)
- [GitHub - Artifact attestations](https://docs.github.com/en/actions/concepts/security/artifact-attestations)
- [SLSA - Supply-chain Levels for Software Artifacts](https://slsa.dev/)
