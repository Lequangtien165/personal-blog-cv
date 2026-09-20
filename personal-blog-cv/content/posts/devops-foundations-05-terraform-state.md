---
title: "DevOps Foundations #5: Terraform state — backend, locking, drift và import"
date: "2026-09-20"
summary: "State là bản đồ ownership giữa code và hạ tầng thật; hiểu sai state có thể dẫn đến mất dữ liệu, lộ secret hoặc thay đổi nhầm tài nguyên."
tags:
  - Terraform
  - IaC
  - DevOps Foundations
---

> Bài 5/12. Nên đọc trước: [Bản chất Terraform](/blog/devops-foundations-04-ban-chat-terraform).

State không đơn giản là cache. Nó là nơi Terraform giữ **binding** giữa địa chỉ trong configuration và object thật. Ví dụ:

```text
aws_s3_bucket.logs <-> bucket có ID company-prod-logs
```

Nếu mất binding này, Terraform không biết block HCL đang đại diện cho bucket nào. Nếu binding sai, Terraform có thể dự định thay đổi nhầm object.

## Vì sao Terraform cần state?

Cloud API không biết `aws_s3_bucket.logs` là tên logic trong code của bạn. Nó chỉ biết ID hoặc ARN thật. State nối hai thế giới và giữ metadata phục vụ dependency, output và performance.

Terraform kỳ vọng quan hệ một-một: một resource instance trong state ánh xạ tới một remote object. Đưa cùng object vào hai state khác nhau tạo hai owner cùng tin rằng mình có quyền thay đổi nó.

## Local state và remote state

Mặc định, state được lưu local trong `terraform.tfstate`. Cách này phù hợp lab cá nhân nhưng yếu cho teamwork:

- file có thể mất;
- hai người có thể apply đồng thời;
- state dễ bị commit nhầm;
- khó kiểm soát quyền và audit.

Remote backend đưa state vào hệ thống dùng chung. Một backend phù hợp cho team cần:

- kiểm soát truy cập;
- mã hóa;
- versioning/backup;
- locking nếu backend hỗ trợ;
- audit và quy trình phục hồi.

Không commit `terraform.tfstate`, `.terraform/` hoặc saved plan vào Git. State và plan có thể chứa dữ liệu nhạy cảm kể cả khi output được đánh dấu `sensitive`.

## Locking giải quyết race condition

Giả sử A và B cùng đọc state version 10. A tạo subnet, B tạo database. Nếu cả hai apply từ snapshot cũ và ghi kết quả, một bản cập nhật state có thể ghi đè bản còn lại.

State locking đảm bảo tại một thời điểm chỉ có một thao tác ghi hợp lệ trên cùng state. Không nên dùng `-lock=false` để vượt lỗi một cách tùy tiện. Trước khi force-unlock, phải xác minh thao tác giữ lock đã kết thúc thật sự; nếu nó vẫn chạy, hai apply đồng thời có thể làm state hỏng.

## State có thể chứa secret

Đánh dấu một variable hoặc output là `sensitive` chủ yếu che nó khỏi giao diện CLI. Giá trị vẫn có thể tồn tại trong state nếu provider/resource ghi nó vào đó.

Vì vậy:

- giới hạn ai đọc backend;
- mã hóa khi truyền và khi lưu;
- không gửi state vào ticket/chat;
- ưu tiên reference đến secret manager thay vì đưa plaintext vào Terraform;
- đọc schema/provider docs để biết dữ liệu nào được lưu.

## Refresh và drift

**Drift** là khi remote object khác configuration/state do thay đổi ngoài Terraform hoặc do API/provider hành xử khác dự kiến.

Trong quá trình plan, Terraform đọc remote object để cập nhật hiểu biết rồi đề xuất thay đổi. Có ba hướng xử lý drift:

1. **Reconcile remote về code:** nếu thay đổi ngoài là trái phép.
2. **Cập nhật code để chấp nhận thực tế:** nếu hotfix ngoài là đúng và cần được quản lý chính thức.
3. **Làm rõ ownership:** nếu thuộc tính do hệ thống khác quản lý.

Đừng lập tức thêm `ignore_changes`. Nó có thể hợp lý khi ownership được chủ động chia sẻ, nhưng cũng có thể che thay đổi quan trọng khiến code không còn là desired state đầy đủ.

## Import: nhận quyền quản lý object có sẵn

Import không tự biến một object thành configuration hoàn chỉnh theo mọi workflow. Mục tiêu cốt lõi là tạo binding giữa resource address và remote ID. Sau import, hãy chạy plan và chỉnh configuration cho đến khi hiểu mọi diff.

Ví dụ khái niệm:

```hcl
import {
  to = aws_s3_bucket.logs
  id = "company-prod-logs"
}
```

Quy trình an toàn:

1. backup state;
2. viết hoặc tạo configuration phù hợp;
3. import đúng address/ID;
4. plan;
5. không apply cho đến khi mọi update/replace ngoài ý muốn đã được giải thích.

Import nhầm ID là lỗi ownership, không chỉ lỗi cú pháp.

## Đổi địa chỉ resource bằng `moved`

Đổi tên resource hoặc chuyển nó vào module làm địa chỉ thay đổi. Nếu chỉ sửa block, Terraform có thể hiểu object cũ bị xóa và object mới cần tạo.

```hcl
moved {
  from = aws_s3_bucket.logs
  to   = module.storage.aws_s3_bucket.logs
}
```

`moved` nói rõ identity vẫn là một object. Đây là refactor state có thể review trong code, an toàn hơn thao tác thủ công không được ghi lại.

## `state rm` không xóa remote object

`terraform state rm` yêu cầu Terraform quên binding; object thật vẫn tồn tại. Sau đó Terraform có thể muốn tạo object mới vì configuration còn resource nhưng state không còn biết object cũ.

Ngược lại, xóa block configuration thường khiến plan đề xuất destroy object đang được state quản lý. Hai hành động khác nhau:

- xóa configuration: bỏ desired object, thường dẫn đến destroy;
- xóa binding khỏi state: bỏ ownership, giữ object thật.

Mọi thao tác state cần backup, review address chính xác và plan ngay sau đó.

## Tách state theo blast radius

Một state khổng lồ cho toàn bộ tổ chức tạo lock contention, quyền quá rộng và plan khó review. Quá nhiều state nhỏ lại tạo nhiều dependency chéo.

Tách theo vòng đời, ownership và blast radius, ví dụ:

- network nền tảng;
- cluster;
- data service;
- application environment.

Đừng dùng workspace như ranh giới bảo mật duy nhất. Những môi trường có quyền và hậu quả khác nhau thường cần backend/credential/pipeline tách rõ.

## Runbook khi nghi state có vấn đề

1. Dừng mọi apply liên quan.
2. Xác định backend, workspace và state key chính xác.
3. Kiểm tra ai đang giữ lock và có run nào còn hoạt động không.
4. Lấy backup/version state trước khi sửa.
5. Dùng `terraform state list` và `terraform state show` thay vì mở JSON để chỉnh tay.
6. So sánh configuration, state binding và remote ID.
7. Thực hiện thao tác nhỏ nhất qua lệnh hỗ trợ chính thức.
8. Chạy plan và review toàn bộ destroy/replace.

Không trực tiếp sửa JSON state trừ tình huống phục hồi đặc biệt với người hiểu format và có backup được kiểm chứng.

## Bài thực hành

Trong một lab không chứa dữ liệu quan trọng:

1. tạo resource và xem `terraform state list`;
2. xem một binding bằng `terraform state show`;
3. thay đổi remote object thủ công để tạo drift;
4. chạy plan và giải thích diff;
5. refactor address bằng block `moved`;
6. xác nhận plan không destroy/create object chỉ vì đổi tên.

## Chốt lại

State là bản đồ ownership, backend là nơi bảo vệ và chia sẻ bản đồ đó, còn locking ngăn nhiều người viết chồng lên nhau. Hiểu state giúp phân biệt thay đổi code, drift, import và refactor — bốn tình huống có bề ngoài giống nhau nhưng hậu quả hoàn toàn khác.

**Bài tiếp theo:** [DevOps Foundations #6: Terraform modules, lifecycle, testing và teamwork](/blog/devops-foundations-06-terraform-teamwork)

---

Nguồn chính thức:

- [Terraform state](https://developer.hashicorp.com/terraform/language/state)
- [Terraform backends: state storage and locking](https://developer.hashicorp.com/terraform/language/state/backends)
- [Import existing resources](https://developer.hashicorp.com/terraform/language/import)
- [Refactor modules with moved blocks](https://developer.hashicorp.com/terraform/language/modules/develop/refactoring)
