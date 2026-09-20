---
title: "DevOps Foundations #3: CD — deployment strategy, health verification và rollback"
date: "2026-09-20"
summary: "Từ artifact bất biến đến release an toàn: promotion, approval, rolling, blue-green, canary, GitOps và tiêu chí rollback."
tags:
  - CI/CD
  - DevOps Foundations
  - GitOps
---

> Bài 3/12. Nên đọc trước: [CI đáng tin cậy](/blog/devops-foundations-02-ci-dang-tin-cay).

CI trả lời “artifact này có đủ bằng chứng để trở thành ứng viên release không?”. CD trả lời “đưa artifact đó đến người dùng thế nào, quan sát ra sao và phản ứng gì khi tín hiệu xấu?”.

## Promotion, không rebuild

Giả sử CI tạo image digest `sha256:abc...`. Staging kiểm tra digest đó. Khi lên production, ta phải promote chính digest ấy. Chỉ cấu hình theo môi trường thay đổi, ví dụ endpoint, replica hoặc giới hạn tài nguyên.

```text
artifact D + config staging    -> staging release
artifact D + config production -> production release
```

Secret không nên đóng vào image. Nó được cấp tại runtime bằng cơ chế của môi trường đích.

## Environment và approval

Mỗi môi trường là một trust boundary. Development, staging và production khác nhau về dữ liệu, quyền, lưu lượng và hậu quả khi sai.

Approval chỉ có giá trị khi người duyệt thấy đủ bằng chứng:

- thay đổi nào sắp được deploy;
- artifact digest nào;
- test/scan nào đã qua;
- migration nào sẽ chạy;
- rủi ro và rollback plan;
- trạng thái hiện tại của môi trường.

Một nút Approve bấm theo thói quen là delay thủ công, không phải kiểm soát.

## Bốn deployment strategy phổ biến

### Recreate

Dừng phiên bản cũ rồi khởi động phiên bản mới. Dễ hiểu nhưng có downtime. Phù hợp lab hoặc workload chấp nhận gián đoạn.

### Rolling update

Thay dần instance cũ bằng instance mới. Tốn ít tài nguyên bổ sung nhưng trong một khoảng thời gian hai version cùng chạy. API và database migration phải tương thích ngược.

### Blue-green

Duy trì môi trường cũ và mới song song, sau đó chuyển traffic. Rollback nhanh bằng cách chuyển lại, nhưng tốn tài nguyên và cần xử lý dữ liệu/migration cẩn thận.

### Canary

Gửi một phần nhỏ traffic sang version mới, quan sát rồi tăng dần. Canary giảm blast radius, nhưng chỉ có ý nghĩa nếu có metric phân biệt version và tiêu chí tự động dừng.

Không có strategy tốt nhất tuyệt đối. Chọn dựa trên downtime cho phép, chi phí, khả năng quan sát, state và độ tương thích của ứng dụng.

## Deployment success khác release health

Hãy tách ba lớp kiểm tra:

1. **Deployment status:** orchestrator đã tạo resource theo yêu cầu chưa?
2. **Technical health:** process chạy, readiness pass, dependency kết nối, error rate và latency ổn không?
3. **Business health:** login, checkout hoặc hành trình cốt lõi còn hoạt động không?

Một tiến trình có thể sống nhưng không phục vụ được traffic. Một endpoint `/health` có thể trả `200` trong khi checkout hỏng. Vì vậy cần cả probe, smoke test và telemetry phù hợp với rủi ro.

## Rollback phải được thiết kế trước

Rollback không phải câu lệnh thần kỳ. Nó có thể thất bại nếu:

- database schema không tương thích với version cũ;
- message mới đã được ghi vào queue;
- secret/config đã đổi;
- side effect bên ngoài không thể đảo ngược;
- artifact cũ đã bị xóa.

Kỹ thuật thường dùng là **expand/contract migration**:

1. thêm schema mới theo cách version cũ vẫn dùng được;
2. deploy code có thể đọc/ghi an toàn trong giai đoạn chuyển tiếp;
3. migrate dữ liệu;
4. chỉ xóa schema cũ sau khi không còn consumer cũ.

Rollback trigger nên định lượng, ví dụ error rate vượt ngưỡng trong một cửa sổ thời gian, readiness không đạt sau timeout hoặc smoke test quan trọng thất bại. Tránh “cảm thấy có vẻ không ổn”.

## GitOps thay đổi vòng điều khiển

Trong push-based deployment, pipeline chủ động gọi vào cluster. Trong GitOps, desired state được version hóa trong Git; một controller trong hoặc gần cluster kéo thay đổi và liên tục reconcile actual state về desired state.

```text
Git desired state -> GitOps controller -> cluster actual state
        ^                    |
        |------ drift/status-|
```

GitOps không có nghĩa “mọi thứ ở Git là tự động an toàn”. Vẫn cần review, policy, secret management, health assessment và giới hạn quyền của controller. Lợi ích chính là desired state có lịch sử, thay đổi có thể audit và drift được phát hiện/reconcile.

## Secret và identity trong deployment

Không lưu cloud access key dài hạn trong repository hay image. Với nền tảng hỗ trợ, pipeline nên dùng OIDC để đổi identity ngắn hạn theo repository, branch, workflow hoặc environment. Quyền production chỉ được cấp cho job production và chỉ trong thời gian cần thiết.

Mental model:

```text
workflow identity + trust policy -> short-lived credential -> scoped action
```

OIDC giảm secret dài hạn nhưng trust policy sai vẫn nguy hiểm. Phải giới hạn subject/audience, môi trường và permission.

## Concurrency và serialization

Hai deployment production chạy đồng thời có thể ghi đè hoặc làm kết quả kiểm chứng lẫn nhau. Dùng concurrency control để mỗi môi trường chỉ có một rollout tại một thời điểm. Một run mới có thể xếp hàng hoặc hủy run cũ tùy chính sách.

## Runbook khi release thất bại

1. Dừng promotion để giới hạn blast radius.
2. Xác định artifact, config và thời điểm thay đổi.
3. Kiểm tra rollout status, events, log và metric theo version.
4. So sánh với baseline trước release.
5. Rollback hoặc roll-forward theo runbook đã chuẩn bị.
6. Xác minh lại cả technical health và hành trình người dùng.
7. Lưu evidence và cập nhật test/runbook sau incident.

Đừng chỉnh trực tiếp production rồi quên đưa thay đổi ngược về Git. Làm vậy tạo drift và lần reconcile sau có thể ghi đè bản sửa.

## Bài thực hành

Với một ứng dụng có endpoint `/health`:

1. triển khai version A;
2. tạo version B trả lỗi có chủ đích trên một endpoint nghiệp vụ;
3. chứng minh process vẫn chạy nhưng smoke test phát hiện lỗi;
4. rollback về đúng artifact A;
5. xác minh endpoint, error log và version đang phục vụ.

Viết rõ trigger, lệnh rollback và bằng chứng thành công. Nếu chỉ nhìn trạng thái “deployed”, bài lab chưa hoàn tất.

## Chốt lại

CD là kiểm soát hành trình của một artifact bất biến qua các môi trường. Một release an toàn cần strategy phù hợp, identity tối thiểu, health verification có ý nghĩa và rollback đã được luyện tập. Deploy xong không phải kết thúc; đó là lúc feedback từ runtime bắt đầu.

**Bài tiếp theo:** [DevOps Foundations #4: Bản chất Terraform và dependency graph](/blog/devops-foundations-04-ban-chat-terraform)

---

Nguồn chính thức:

- [GitHub Actions - Deployments and environments](https://docs.github.com/en/actions/reference/workflows-and-actions/deployments-and-environments)
- [GitHub Actions - OpenID Connect](https://docs.github.com/en/actions/reference/security/oidc)
- [OpenGitOps principles](https://opengitops.dev/)
- [Argo CD - Automated Sync Policy](https://argo-cd.readthedocs.io/en/stable/user-guide/auto_sync/)
