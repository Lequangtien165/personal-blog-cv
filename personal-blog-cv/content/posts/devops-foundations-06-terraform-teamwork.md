---
title: "DevOps Foundations #6: Terraform modules, lifecycle, testing và teamwork"
date: "2026-09-20"
summary: "Thiết kế module có interface rõ, identity ổn định và pipeline Terraform an toàn cho nhiều người cùng thay đổi hạ tầng."
tags:
  - Terraform
  - IaC
  - DevOps Foundations
---

> Bài 6/12. Nên đọc trước: [Terraform state](/blog/devops-foundations-05-terraform-state).

Terraform bắt đầu khó không phải khi có nhiều dòng HCL, mà khi nhiều người, nhiều môi trường và nhiều vòng đời cùng tồn tại. Lúc này module, identity, test và quy trình review quan trọng hơn việc rút ngắn code.

## Module là một interface, không chỉ một folder

Mọi Terraform configuration đều là module. Root module là nơi bạn chạy Terraform; child module được gọi từ module khác.

Một module tốt che giấu chi tiết hợp lý nhưng làm rõ contract:

- input nào bắt buộc và type gì;
- output nào được consumer cần;
- resource nào module sở hữu;
- precondition/validation nào được áp dụng;
- nâng version có breaking change gì.

```hcl
module "network" {
  source = "./modules/network"

  name             = "app-prod"
  cidr_block       = "10.20.0.0/16"
  availability_zones = ["zone-a", "zone-b"]
}
```

Đừng tạo module chỉ để bọc một resource mà không tạo abstraction có ý nghĩa. Cũng đừng làm module “vạn năng” với hàng chục cờ boolean và nhánh logic khó dự đoán.

## Root module và reusable module

Reusable module nên độc lập với tên môi trường cụ thể. Root module ghép module, chọn provider/backend và truyền policy của môi trường.

```text
live/prod/       -> root module, backend và giá trị prod
live/staging/    -> root module, backend và giá trị staging
modules/network/ -> reusable module
modules/cluster/ -> reusable module
```

Không sao chép toàn bộ code giữa môi trường. Nhưng cũng không ép tất cả môi trường dùng chung một state.

## `count` và `for_each`: identity quan trọng hơn cú pháp

`count` định danh instance bằng chỉ số:

```hcl
resource "example_user" "team" {
  count = length(var.names)
  name  = var.names[count.index]
}
```

Nếu xóa phần tử giữa danh sách, các chỉ số sau nó đổi và có thể tạo nhiều update/replace.

`for_each` dùng key ổn định:

```hcl
resource "example_user" "team" {
  for_each = toset(var.names)
  name     = each.key
}
```

Chọn key đại diện cho identity lâu dài, không dùng giá trị dễ đổi như display name nếu đổi tên không nên tạo object mới.

## Lifecycle không phải nút “an toàn tuyệt đối”

Các rule thường gặp:

- `create_before_destroy`: tạo mới trước rồi xóa cũ nếu API và quota cho phép;
- `prevent_destroy`: chặn plan destroy trong một số tình huống;
- `ignore_changes`: bỏ qua diff của thuộc tính đã chọn;
- `replace_triggered_by`: thay object khi dependency cụ thể đổi.

`prevent_destroy` không bảo vệ object nếu resource block bị xóa khỏi configuration, vì rule cũng biến mất. Nó là guardrail, không thay thế backup, IAM và review.

`ignore_changes` phải đi kèm câu trả lời “ai là owner của thuộc tính bị bỏ qua?”. Nếu không có owner rõ, nó chỉ che drift.

## Version constraint và lock file

Terraform core, provider và module đều có version. Cần:

- khai báo Terraform version phù hợp;
- khai báo provider constraint có chủ đích;
- commit dependency lock file của root module;
- nâng version bằng pull request riêng, đọc changelog và review plan.

Không đặt constraint quá rộng khiến pipeline tự nhận major version mới. Không khóa mãi một version cũ mà không có lịch nâng. Mục tiêu là thay đổi có kiểm soát.

## Các lớp kiểm tra

Một pipeline Terraform có thể đi từ rẻ đến sâu:

1. `terraform fmt -check`;
2. `terraform init` với backend bị vô hiệu hóa khi chỉ validate;
3. `terraform validate`;
4. static analysis/security policy;
5. `terraform test` cho module khi phù hợp;
6. plan trên environment đích bằng identity chỉ đọc/plan;
7. human hoặc policy review destroy/replace/cost;
8. apply saved plan bằng quyền và approval phù hợp;
9. post-apply verification.

`validate` không gọi mọi remote API và không chứng minh resource deploy được. `plan` sâu hơn nhưng vẫn không chứng minh application chạy khỏe sau apply.

## Plan trong pull request

Plan giúp reviewer thấy hậu quả, nhưng cần bảo vệ dữ liệu:

- không đăng plan có secret vào PR công khai;
- plan phải đến từ commit đang review;
- saved plan chỉ được apply nếu commit, input và environment không đổi;
- production plan không chạy với code PR không tin cậy cùng credential mạnh;
- chỉ pipeline tin cậy được apply.

Hai người review HCL nhưng apply một plan của commit khác là mất liên kết bằng chứng.

## Tách quyền plan và apply

Identity cho plan thường chỉ cần đọc hạ tầng cộng quyền tối thiểu để provider lập kế hoạch. Identity apply cần quyền ghi nhưng chỉ được cấp sau gate. Với OIDC, token ngắn hạn có thể bị ràng buộc theo repository, branch và environment.

```text
pull request -> fmt/validate/test/plan(read)
merge        -> plan lại trên commit đã merge
approval     -> apply(saved plan, write)
verify       -> endpoint/metric/resource checks
```

Không dùng access key cá nhân dài hạn trong CI.

## Policy và guardrail

Policy as code có thể chặn:

- public access ngoài ý muốn;
- resource không có encryption;
- region hoặc instance type không được phép;
- thiếu tag ownership/cost;
- destroy resource quan trọng.

Policy cần version, test và exception process. Một policy sai có thể chặn mọi thay đổi hoặc tạo cảm giác an toàn giả.

## Review plan theo blast radius

Đọc plan theo thứ tự:

1. Có destroy hoặc replace không?
2. Identity/address nào thay đổi?
3. Dữ liệu/stateful resource có bị ảnh hưởng không?
4. Network/IAM thay đổi phạm vi truy cập thế nào?
5. Giá trị unknown nào khiến hậu quả chưa rõ?
6. Chi phí và quota thay đổi ra sao?
7. Có dependency downstream không?
8. Backup và rollback/roll-forward plan là gì?

Đừng approve chỉ vì dòng cuối ghi `1 to add, 0 to change, 0 to destroy`. Một IAM policy mới duy nhất vẫn có thể tạo blast radius lớn.

## Testing module

Test có thể kiểm tra input validation, output, resource attribute và hành vi của module. Tách:

- test không tạo hạ tầng thật: nhanh và rẻ;
- test integration tạo resource thật: thực tế hơn nhưng cần account sandbox, quota, cleanup và cost control.

Nếu test tạo cloud resource, luôn có cơ chế cleanup và job định kỳ phát hiện tài nguyên rò rỉ. “Test thất bại trước destroy” không được biến thành hóa đơn kéo dài.

## Bài thực hành

Refactor một configuration thành module:

1. xác định interface input/output;
2. dùng block `moved` để giữ identity;
3. chạy plan và chứng minh không recreate ngoài ý muốn;
4. thêm validation cho input;
5. viết ít nhất một test pass và một test cố tình fail;
6. mô tả quyền cần cho plan và apply riêng biệt.

## Chốt lại

Terraform ở quy mô team là bài toán ownership và kiểm soát thay đổi. Module tạo contract, key giữ identity, lifecycle điều chỉnh graph, state giữ binding, còn pipeline nối review với đúng plan và đúng quyền. Code ngắn hơn chỉ là lợi ích phụ.

**Bài tiếp theo:** [DevOps Foundations #7: Bản chất Kubernetes và reconciliation loop](/blog/devops-foundations-07-ban-chat-kubernetes)

---

Nguồn chính thức:

- [Terraform modules](https://developer.hashicorp.com/terraform/language/modules)
- [Terraform lifecycle meta-argument](https://developer.hashicorp.com/terraform/language/meta-arguments/lifecycle)
- [Terraform tests](https://developer.hashicorp.com/terraform/language/tests)
- [Terraform dependency lock file](https://developer.hashicorp.com/terraform/language/files/dependency-lock)
