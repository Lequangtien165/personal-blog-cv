---
title: "DevOps Foundations #12: Capstone — Terraform → CI/CD → Kubernetes"
date: "2026-09-20"
summary: "Ghép toàn bộ series thành một hệ thống delivery có desired state, artifact bất biến, policy, health verification, rollback và game day."
tags:
  - Kubernetes
  - Terraform
  - CI/CD
  - DevOps Foundations
---

> Bài 12/12. Đây là capstone tổng hợp. Nếu một phần còn mơ hồ, quay lại [bài mở đầu về CI/CD](/blog/devops-foundations-01-ban-chat-cicd), [Terraform](/blog/devops-foundations-04-ban-chat-terraform) hoặc [Kubernetes](/blog/devops-foundations-07-ban-chat-kubernetes).

Capstone này không nhằm khoe nhiều tool. Mục tiêu là chứng minh một vòng delivery hoàn chỉnh: hạ tầng có owner, artifact truy được nguồn gốc, deployment có health gate, runtime có evidence và failure có đường phục hồi.

## Bài toán

Triển khai một web API nhỏ có:

- `/live`: process còn hoạt động;
- `/ready`: instance đủ điều kiện nhận traffic;
- `/version`: trả commit SHA hoặc build version;
- `/metrics` hoặc log có cấu trúc để quan sát request/error/latency.

Hệ thống gồm:

```text
Git source
  |
  +-> CI: test -> build -> scan -> image digest -> provenance
  |                                      |
  |                                      v
  +-> Terraform: network/cluster/IAM/registry
  |                                      |
  +-> GitOps/CD desired state ------------+
                                         v
                          Gateway -> Service -> Deployment
                                         |
                                  logs/metrics/events
```

Bạn có thể làm local bằng kind/minikube để học vòng điều khiển. Bản cloud cần account, quota, chi phí, IAM và backend thật; không được gọi là “live verified” nếu mới chỉ plan hoặc mô phỏng.

## Ranh giới ownership

Đặt quy ước trước khi viết code:

- Terraform sở hữu network, cluster, registry, IAM/workload identity và integration nền tảng.
- Kubernetes manifest/Helm sở hữu namespace, Deployment, Service, ConfigMap, policy và application routing.
- CI build và kiểm tra artifact.
- CD/GitOps promote desired application version và quan sát rollout.
- Secret manager/identity system sở hữu secret gốc; Git chỉ chứa reference hoặc encrypted form theo thiết kế.

Không để Terraform và Helm cùng quản lý một object Kubernetes nếu chưa có lý do và contract rõ.

## Cấu trúc repository tham khảo

```text
app/
  src/
  tests/
  Dockerfile
infra/
  modules/
    network/
    cluster/
  environments/
    staging/
    production/
deploy/
  base/
    deployment.yaml
    service.yaml
  overlays/
    staging/
    production/
.github/workflows/
docs/
  runbooks/
  evidence/
```

Một repo hay nhiều repo là quyết định tổ chức. Điều bắt buộc là trace được thay đổi nào tạo artifact nào và desired state nào triển khai artifact đó.

## Giai đoạn 1: application contract

Trước hạ tầng, định nghĩa behavior:

- `/live` không phụ thuộc dịch vụ ngoài nếu process vẫn có thể phục hồi;
- `/ready` chỉ pass khi instance phục vụ request an toàn;
- `/version` không tiết lộ secret;
- shutdown xử lý tín hiệu và ngừng nhận traffic trước khi exit;
- log có timestamp, level, request/correlation ID và error context.

Viết unit test và smoke test. Chạy local trước để tách lỗi app khỏi lỗi cluster.

## Giai đoạn 2: container artifact

Dockerfile cần:

- base image có version/digest được kiểm soát;
- multi-stage build nếu giúp giảm runtime image;
- user non-root;
- chỉ copy file cần thiết;
- không chứa credential;
- entrypoint nhận signal đúng;
- image label/metadata gắn commit SHA.

Sau build, ghi nhận image digest. Tag `staging` hoặc `latest` không đủ làm bằng chứng vì có thể trỏ sang nội dung khác.

## Giai đoạn 3: Terraform foundation

Terraform workflow:

```text
fmt -> validate -> test/static policy -> plan -> review -> apply saved plan -> verify
```

Thiết kế:

- remote state tách theo environment/blast radius;
- state locking và backup/versioning;
- OIDC hoặc identity ngắn hạn cho CI;
- plan identity và apply identity tách quyền;
- module interface nhỏ, typed và có validation;
- output chỉ công bố thông tin consumer cần.

Post-apply verification không chỉ nhìn `Apply complete`. Kiểm tra cluster endpoint, node readiness, registry access từ đúng identity và controller/add-on cần thiết.

## Giai đoạn 4: Kubernetes desired state

Application tối thiểu cần:

- Deployment từ hai replica cho bài availability;
- image theo digest;
- startup/readiness/liveness probe;
- request/limit có giải thích;
- Service chọn đúng label;
- ConfigMap cho config không bí mật;
- ServiceAccount riêng với quyền tối thiểu;
- security context non-root, drop capability, seccomp;
- NetworkPolicy theo luồng thật;
- topology spread hoặc anti-affinity nếu cluster có nhiều failure domain;
- PDB hợp lý cho voluntary disruption.

Không thêm object chỉ để đủ checklist. Ví dụ PDB trên ứng dụng một replica không tạo high availability.

## Giai đoạn 5: CI

Pull request pipeline nên:

1. lint/type/static checks;
2. unit và integration test;
3. validate Dockerfile/IaC/manifest;
4. phát hiện secret;
5. build thử nhưng không nhận quyền production;
6. plan Terraform bằng quyền phù hợp nếu nguồn tin cậy;
7. lưu test report và plan an toàn để review.

Pipeline trên commit đã merge:

1. build image một lần;
2. scan image và dependency theo policy;
3. tạo SBOM/provenance nếu áp dụng;
4. push registry;
5. xuất digest bất biến;
6. không build lại ở bước deploy.

## Giai đoạn 6: CD/GitOps

Cập nhật desired state staging bằng digest mới. Controller hoặc pipeline deploy rồi chờ:

```powershell
kubectl rollout status deployment/web -n app --timeout=180s
```

Sau đó chạy smoke test:

1. `/version` trả đúng commit/digest mapping;
2. endpoint cốt lõi trả đúng nội dung;
3. error rate và latency trong ngưỡng quan sát;
4. tất cả ready replica xuất hiện trong EndpointSlice;
5. log không có lỗi dependency mới.

Chỉ promote **cùng digest** sang production sau gate. Production cần concurrency control và approval/protection rule phù hợp rủi ro.

## Giai đoạn 7: rollback và database

Lưu artifact/manifest revision trước. Tạo runbook:

- trigger rollback định lượng;
- người/hệ thống có quyền kích hoạt;
- lệnh hoặc Git revert cụ thể;
- cách xử lý config và migration;
- tiêu chí xác minh sau rollback.

Nếu có database, dùng migration tương thích ngược theo expand/contract. Không gọi rollback “an toàn” nếu version cũ không đọc được schema mới.

## Giai đoạn 8: game day

Tạo lỗi có kiểm soát, mỗi lần một lỗi:

### Thí nghiệm A: image không tồn tại

Kỳ vọng `ImagePullBackOff`. Evidence: Pod status, events, image reference. Fix bằng digest hợp lệ rồi xác minh rollout.

### Thí nghiệm B: readiness sai port

Kỳ vọng Pod Running nhưng NotReady và Service thiếu ready endpoint. Evidence: probe event, EndpointSlice, application listen port.

### Thí nghiệm C: request vượt capacity

Kỳ vọng Pending/FailedScheduling. Evidence: scheduler event và node allocatable/request.

### Thí nghiệm D: NetworkPolicy chặn dependency

Kỳ vọng timeout có phạm vi. Evidence: DNS còn hoạt động, policy selector, source egress và destination ingress.

### Thí nghiệm E: bad release

Version mới trả lỗi trên smoke test. Kỳ vọng gate dừng promotion hoặc rollback về digest cũ; `/version` và error metric xác nhận phục hồi.

## Evidence matrix

Mỗi claim phải gắn với bằng chứng:

- “CI kiểm tra code” → test report của commit cụ thể.
- “Artifact bất biến” → registry digest và provenance.
- “Terraform quản lý hạ tầng” → reviewed plan, state binding và post-apply check.
- “Deployment khỏe” → rollout condition, ready endpoint và smoke test.
- “Network được giới hạn” → policy cộng connectivity test allow/deny.
- “Rollback hoạt động” → bad release bị phát hiện, digest cũ phục hồi, metric trở lại baseline.
- “Có backup” → restore test và dữ liệu kiểm tra được, không chỉ log job backup.

Phân biệt rõ:

- **docs-verified:** hành vi được tài liệu chính thức mô tả;
- **locally observed:** đã chạy trên cluster local;
- **dry-run/plan:** chỉ dự đoán thay đổi;
- **mocked:** dependency giả lập;
- **live end-to-end:** đã chạy trên môi trường thật với evidence đầu cuối.

## Definition of Done

Capstone chỉ hoàn tất khi:

1. người khác có thể dựng lại theo README;
2. không có secret trong Git/state output công khai;
3. CI đỏ khi test có chủ đích bị phá;
4. cùng một digest được promote;
5. manifest có probe, resource và security baseline được giải thích;
6. post-deploy verification kiểm tra behavior, không chỉ trạng thái lệnh;
7. ít nhất ba failure scenario có evidence;
8. rollback hoặc roll-forward được thực hành;
9. cost/resource cleanup được xác nhận;
10. mọi claim ghi đúng mức bằng chứng.

## Cách tự kiểm tra đã hiểu bản chất chưa

Bạn nên trả lời được mà không nhìn tài liệu:

- Vì sao CI xanh chưa chứng minh release khỏe?
- Vì sao build once quan trọng?
- Terraform state lưu ownership gì?
- Khi nào plan buộc replace?
- Kubernetes controller khác scheduler và kubelet thế nào?
- Vì sao Pod Running vẫn không nhận traffic?
- Service tìm backend bằng gì?
- Vì sao Secret base64 chưa đủ an toàn?
- Request và limit ảnh hưởng khác nhau ra sao?
- Evidence nào chứng minh rollback thật sự phục hồi?

Nếu trả lời được bằng luồng nhân quả và có thể chứng minh trong lab, bạn đã vượt qua mức “biết dùng lệnh”.

## Chốt series

Ba stack nối với nhau bằng cùng một tư tưởng: **desired state, feedback và evidence**.

- Terraform reconcile hạ tầng theo plan và state.
- Kubernetes controller reconcile workload liên tục.
- CI/CD đưa thay đổi qua các gate và dùng runtime feedback để quyết định promote hay rollback.

Hiểu bản chất không phải nhớ mọi option. Đó là biết hệ thống muốn đạt trạng thái nào, thành phần nào chịu trách nhiệm, tín hiệu nào chứng minh trạng thái thật, failure có thể xuất hiện ở đâu và cách đưa hệ thống trở lại an toàn.

**Quay lại đầu series:** [DevOps Foundations #1: Bản chất CI/CD](/blog/devops-foundations-01-ban-chat-cicd)

---

Nguồn chính thức:

- [Terraform documentation](https://developer.hashicorp.com/terraform/docs)
- [Kubernetes concepts](https://kubernetes.io/docs/concepts/)
- [GitHub Actions documentation](https://docs.github.com/en/actions)
- [OpenGitOps principles](https://opengitops.dev/)
