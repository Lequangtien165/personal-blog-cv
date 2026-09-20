---
title: "DevOps Foundations #4: Bản chất Terraform — declarative IaC và dependency graph"
date: "2026-09-20"
summary: "Hiểu Terraform không phải như công cụ chạy script, mà như bộ máy so sánh desired state, state và hạ tầng thật để lập kế hoạch thay đổi."
tags:
  - Terraform
  - IaC
  - DevOps Foundations
---

> Bài 4/12. Bắt đầu phần Terraform sau [series CI/CD](/blog/devops-foundations-03-cd-va-rollback).

Terraform thường được giới thiệu bằng câu “viết hạ tầng bằng code”. Câu đó đúng nhưng chưa đủ. Bản chất của Terraform là: **nhận mô tả trạng thái mong muốn, kết hợp với state và dữ liệu đọc từ provider, tạo dependency graph rồi lập kế hoạch đưa tài nguyên thật về trạng thái đó**.

## Declarative khác imperative

Imperative mô tả từng bước:

```text
tạo network
tạo subnet
tạo server
gắn server vào subnet
```

Declarative mô tả kết quả mong muốn và quan hệ:

```hcl
resource "example_network" "main" {
  cidr = "10.0.0.0/16"
}

resource "example_subnet" "app" {
  network_id = example_network.main.id
  cidr       = "10.0.1.0/24"
}
```

Tham chiếu `example_network.main.id` vừa lấy giá trị, vừa tạo dependency. Terraform hiểu subnet phải chờ network mà không cần một câu `sleep` hay chỉ định thứ tự bằng tay.

Declarative không có nghĩa Terraform “tự biết mọi thứ”. Provider phải mô tả schema và cách create/read/update/delete resource. Một số thay đổi có thể update tại chỗ; số khác buộc destroy rồi create lại do giới hạn API.

## Ba trạng thái cần phân biệt

Terraform ra quyết định dựa trên ba góc nhìn:

1. **Configuration:** HCL trong repository nói ta muốn gì.
2. **State:** Terraform đang ánh xạ địa chỉ resource nào tới object thật nào.
3. **Remote object:** cloud, SaaS hoặc API hiện đang có gì.

`terraform plan` so sánh các góc nhìn này và tạo proposed changes. `terraform apply` thực hiện một plan sau khi dependency graph và điều kiện cho phép.

```text
configuration -----\
                    -> plan -> dependency graph -> provider APIs
state --------------/
remote refresh -----/
```

Vì vậy Terraform không chỉ “đọc file rồi gọi API”. State là phần bắt buộc của mô hình, sẽ được giải thích sâu ở bài sau.

## Provider, resource và data source

**Provider** là plugin giúp Terraform giao tiếp với một API. Provider configuration thường chứa region, endpoint hoặc cách xác thực, nhưng credential nên đến từ cơ chế an toàn của môi trường chứ không hard-code.

**Resource** là object Terraform quản lý vòng đời:

```hcl
resource "aws_s3_bucket" "logs" {
  bucket = var.log_bucket_name
}
```

**Data source** đọc một object tồn tại nhưng không nhận quyền quản lý vòng đời object đó:

```hcl
data "aws_caller_identity" "current" {}

output "account_id" {
  value = data.aws_caller_identity.current.account_id
}
```

Đừng nhầm “Terraform biết object” với “Terraform sở hữu object”. Quyền sở hữu được thể hiện bằng resource binding trong state.

## Variable, local và output

- **variable** là input của module.
- **local** đặt tên cho một biểu thức nội bộ để tránh lặp hoặc làm rõ ý nghĩa.
- **output** là interface đầu ra cho người dùng hoặc module gọi nó.

```hcl
variable "environment" {
  type = string

  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "environment must be dev, staging, or prod"
  }
}

locals {
  common_tags = {
    Environment = var.environment
    ManagedBy   = "terraform"
  }
}
```

Khai báo type và validation giúp lỗi xuất hiện trước khi provider gọi API.

## Dependency graph

Terraform tạo graph từ:

- tham chiếu giữa resource/data/module;
- dependency được lưu trong state;
- quan hệ provider;
- `depends_on` khi dependency tồn tại nhưng không thể biểu diễn bằng dữ liệu.

Các node độc lập có thể chạy song song. Đây là lý do thứ tự block trong file không quyết định thứ tự tạo resource.

Ưu tiên **implicit dependency** bằng tham chiếu. `depends_on` chỉ dùng khi hành vi của object A phụ thuộc vào object B nhưng không lấy thuộc tính nào của B. Lạm dụng `depends_on` làm graph bảo thủ hơn, tạo nhiều unknown value và khó hiểu.

## Unknown value trong plan

Một số giá trị chỉ tồn tại sau apply, ví dụ ID do cloud cấp. Plan có thể hiển thị `(known after apply)`. Đây không phải lỗi; nó nói Terraform biết quan hệ nhưng chưa thể biết giá trị.

Tuy nhiên Terraform cần biết identity của các instance trước apply. Vì vậy biểu thức dùng trong `for_each` thường phải được xác định ở plan time. Không thể lấy một tập key hoàn toàn chưa biết rồi yêu cầu Terraform quyết định có bao nhiêu resource.

## Vòng lặp làm việc chuẩn

```powershell
terraform fmt -check
terraform init
terraform validate
terraform plan -out=tfplan
terraform apply tfplan
```

Ý nghĩa:

- `fmt` chuẩn hóa định dạng;
- `init` tải provider/module và cấu hình backend;
- `validate` kiểm tra cấu trúc và tính nhất quán nội bộ;
- `plan` xem proposed changes;
- `apply` thực hiện đúng saved plan đã review.

Không phải mọi `plan` sạch đều chứng minh hạ tầng an toàn. Nó không tự hiểu yêu cầu nghiệp vụ, chi phí, khả năng phục hồi hay blast radius. Review phải chú ý ký hiệu create/update/destroy/replace và các giá trị sensitive.

## Idempotence được hiểu đúng

Nếu configuration, state và remote object không đổi, chạy plan lần nữa nên không có thay đổi. Nhưng nói “Terraform luôn idempotent” quá đơn giản. Provider bug, API tạo default động, timestamp ngẫu nhiên hoặc hệ thống khác cùng sửa object có thể tạo perpetual diff.

Khi plan cứ thay đổi cùng một thuộc tính, hãy kiểm tra:

1. thuộc tính đó do ai sở hữu;
2. API có normalize giá trị không;
3. provider version có thay đổi hành vi không;
4. có process khác đang sửa object không;
5. `ignore_changes` có đang che một xung đột ownership không.

## Terraform không thay thế mọi công cụ

Terraform mạnh ở provisioning và quản lý object có API. Nó không phải lựa chọn tốt để chạy chuỗi script cấu hình máy chủ dài, quản lý package liên tục hoặc điều phối application release ở mọi tình huống.

Một ranh giới dễ hiểu:

- Terraform tạo network, compute, managed database, IAM và cluster.
- Công cụ cấu hình như Ansible cấu hình host khi cần.
- Kubernetes/Helm/GitOps quản lý application workload trong cluster.
- CI/CD điều phối kiểm tra, approval và promotion.

Ranh giới có thể khác theo tổ chức, nhưng mỗi object nên có một owner rõ ràng.

## Bài thực hành

Tạo một module local dùng provider không gây chi phí hoặc một sandbox cloud. Trước mỗi lệnh, dự đoán output:

1. chạy plan khi chưa có resource;
2. apply;
3. chạy plan lần hai và xác nhận no changes;
4. đổi một thuộc tính update được;
5. đổi một thuộc tính buộc replace;
6. dùng `terraform graph` để quan sát dependency.

Không chạy `apply` nếu chưa hiểu action trong plan.

## Chốt lại

Terraform là bộ máy reconciliation theo đợt: configuration mô tả desired state, state giữ binding, provider quan sát và thay đổi object thật, còn graph quyết định quan hệ và mức song song. Hiểu bốn phần này giúp bạn lý giải hành vi thay vì học thuộc lệnh.

**Bài tiếp theo:** [DevOps Foundations #5: Terraform state, backend, locking và drift](/blog/devops-foundations-05-terraform-state)

---

Nguồn chính thức:

- [Terraform language](https://developer.hashicorp.com/terraform/language)
- [Terraform dependency graph](https://developer.hashicorp.com/terraform/internals/graph)
- [Terraform resource block reference](https://developer.hashicorp.com/terraform/language/block/resource)
