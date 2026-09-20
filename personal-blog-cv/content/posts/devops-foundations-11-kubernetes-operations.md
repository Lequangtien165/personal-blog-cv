---
title: "DevOps Foundations #11: Kubernetes operations — scheduling, security và troubleshooting"
date: "2026-09-20"
summary: "Hiểu vì sao Pod được đặt lên node, cách thu hẹp quyền và một quy trình chẩn đoán từ triệu chứng đến nguyên nhân gốc."
tags:
  - Kubernetes
  - Security
  - DevOps Foundations
---

> Bài 11/12. Nên đọc trước: [Config, Secret và persistent storage](/blog/devops-foundations-10-kubernetes-config-storage).

Một cluster vận hành tốt không chỉ có Pod Running. Workload phải được đặt đúng nơi, có đủ tài nguyên, giới hạn blast radius, để lại tín hiệu quan sát được và có runbook phục hồi.

## Scheduler quyết định thế nào?

Quá trình được đơn giản hóa thành:

1. **Filter:** loại node không đáp ứng request, selector/affinity, taint, volume topology và constraint khác.
2. **Score:** chấm điểm các node còn lại theo plugin/chính sách.
3. **Bind:** ghi node được chọn vào Pod.

Scheduler dựa nhiều vào **requests**, không phải usage tức thời. Node nhìn có vẻ ít CPU trong dashboard vẫn có thể không nhận Pod nếu tổng request đã hết allocatable.

## nodeSelector, affinity và topology spread

`nodeSelector` là ràng buộc label đơn giản. Node affinity biểu diễn rule bắt buộc hoặc ưu tiên phức tạp hơn. Pod affinity/anti-affinity đặt Pod gần hoặc xa workload khác, nhưng rule nặng có thể làm scheduling chậm hoặc khiến Pod Pending.

Topology spread constraints giúp phân phối replica qua zone/node để tránh dồn vào một failure domain. Tuy nhiên phân phối chỉ có tác dụng nếu cluster có capacity ở các domain đó.

Đừng đặt constraint cứng hơn khả năng cung cấp capacity. Availability policy không thể tạo node từ không khí.

## Taint và toleration

Taint nói node “không nhận Pod bình thường”. Toleration cho phép Pod chịu được taint tương ứng, nhưng **không đảm bảo** Pod sẽ được đặt lên node đó. Muốn thu hút Pod vào nhóm node, kết hợp label/affinity.

Use case: node GPU, workload đặc quyền hoặc node chuyên dụng. Toleration quá rộng có thể đưa workload thông thường vào node đắt tiền hoặc nhạy cảm.

## PodDisruptionBudget

PDB giới hạn số Pod của một workload bị gián đoạn bởi **voluntary disruption** như drain theo API eviction. Nó không ngăn node crash, OOM, network partition hoặc mọi hình thức xóa trực tiếp.

PDB quá chặt có thể chặn maintenance. PDB chỉ hữu ích khi workload có đủ replica, readiness đúng và capacity để reschedule.

## Security theo nhiều lớp

Không có một cờ `secure: true`. Hãy nghĩ theo các lớp:

1. **Cloud/datacenter:** IAM, network, disk encryption, control-plane access.
2. **Cluster:** API authentication, RBAC, admission, audit, etcd protection.
3. **Workload/container:** image, runtime security context, ServiceAccount, NetworkPolicy.
4. **Application:** auth, validation, secret handling, dependency và business authorization.

Managed Kubernetes chỉ chuyển một phần trách nhiệm control plane sang provider; workload, identity, data và policy vẫn là trách nhiệm của bạn.

## RBAC và ServiceAccount

RBAC trả lời identity nào được thực hiện verb nào trên resource nào trong scope nào.

- Role/ClusterRole chứa permission.
- RoleBinding/ClusterRoleBinding gắn permission với user, group hoặc ServiceAccount.
- namespace scope được ưu tiên khi đủ dùng.

Không cấp `cluster-admin` để sửa nhanh một lỗi permission. Dùng:

```powershell
kubectl auth can-i get secrets --as=system:serviceaccount:app:web -n app
```

Kiểm tra đúng verb/resource/subresource. Quyền `get` Secret khác `list` toàn bộ Secret; quyền tạo Pod đôi khi có thể gián tiếp dùng ServiceAccount mạnh nếu admission không hạn chế.

## Security context tối thiểu

Ví dụ baseline cho workload tương thích:

```yaml
securityContext:
  runAsNonRoot: true
  seccompProfile:
    type: RuntimeDefault
containers:
  - name: web
    securityContext:
      allowPrivilegeEscalation: false
      readOnlyRootFilesystem: true
      capabilities:
        drop:
          - ALL
```

Không copy cấu hình mà không test: app có thể cần ghi vào một path và phải được cấp `emptyDir` phù hợp. Mục tiêu là cấp đúng khả năng cần thiết, không làm app hỏng rồi quay lại privileged.

Pod Security Admission có thể áp profile theo namespace. Nó là guardrail cho Pod spec, không quét lỗ hổng image và không thay thế runtime detection.

## Image và admission

Nên:

- dùng image tối thiểu và cập nhật;
- chạy non-root;
- scan dependency/image;
- deploy theo digest;
- kiểm soát registry được phép;
- xác minh signature/provenance khi quy trình yêu cầu;
- chặn privileged, host namespace và hostPath ngoài use case được review.

Scan “không có critical CVE” không chứng minh image an toàn; vẫn cần xem exploitability, configuration và code.

## Bốn nguồn tín hiệu chính

- **Status/conditions:** trạng thái object mà controller báo.
- **Events:** quyết định gần đây như FailedScheduling, pull image, mount volume.
- **Logs:** application và component nói gì.
- **Metrics/traces:** xu hướng tài nguyên, lỗi, latency và đường request.

Event có thời gian lưu giới hạn; log trong container có thể mất khi Pod bị xóa. Production cần thu thập tập trung và retention phù hợp.

## Quy trình troubleshooting có hệ thống

### 1. Xác định triệu chứng và phạm vi

Một user, một Pod, một node, một namespace hay toàn cluster? Bắt đầu bằng thời điểm và thay đổi gần nhất.

### 2. Kiểm tra desired và observed state

```powershell
kubectl get deployment,pod,service -n app
kubectl describe deployment web -n app
kubectl describe pod <pod-name> -n app
```

Đọc conditions và events trước khi xóa Pod.

### 3. Đi theo dependency

Deployment → ReplicaSet → Pod → node → container; hoặc Gateway → Service → EndpointSlice → Pod → application.

### 4. So sánh instance tốt và xấu

So image digest, config version, node, restart count, resource usage và dependency response.

### 5. Thay đổi một biến

Tạo giả thuyết, thu evidence, thay đổi nhỏ, kiểm chứng. Restart ngẫu nhiên có thể xóa triệu chứng và bằng chứng mà không sửa nguyên nhân.

## Một số lỗi điển hình

- **FailedScheduling:** đọc event về resource, taint, affinity, PVC.
- **NotReady:** kiểm tra readiness, port, dependency và EndpointSlice.
- **CrashLoopBackOff:** exit code, `--previous`, config, secret, liveness.
- **Timeout từ ngoài:** DNS/Gateway/Service/NetworkPolicy/app theo từng hop.
- **Node pressure:** allocatable, request, disk/memory pressure, eviction và daemon workload.
- **Forbidden:** dùng `kubectl auth can-i`, xem đúng identity và binding; không tăng quyền mù quáng.

## Backup và disaster recovery

Backup cluster state và backup application data là hai việc khác nhau. Với self-managed control plane cần chiến lược etcd; với managed service cần biết provider bảo vệ phần nào. Database/PV cần snapshot hoặc application-consistent backup riêng.

Một backup chỉ được xem là bằng chứng khi restore đã chạy thành công trong môi trường cô lập và tiêu chí dữ liệu được kiểm tra. “Job backup màu xanh” chỉ chứng minh job kết thúc theo logic đã viết.

## Bài thực hành game day

Trong lab, lần lượt tạo bốn lỗi:

1. request CPU quá lớn làm Pod Pending;
2. Service selector sai làm mất endpoint;
3. NetworkPolicy chặn traffic;
4. ServiceAccount thiếu quyền đọc object thử nghiệm.

Với mỗi lỗi, ghi: symptom, hypothesis, command/evidence, root cause, fix và verification. Không xóa/redeploy toàn bộ cluster để né chẩn đoán.

## Chốt lại

Scheduling dùng request và constraint để đặt Pod; security giảm quyền ở mọi lớp; troubleshooting nối desired state với evidence từ status, event, log và metric. Người vận hành giỏi không phải người nhớ nhiều lệnh nhất, mà là người thu hẹp failure domain có phương pháp và xác minh bản sửa.

**Bài tiếp theo:** [DevOps Foundations #12: Capstone Terraform → CI/CD → Kubernetes](/blog/devops-foundations-12-capstone)

---

Nguồn chính thức:

- [Kubernetes scheduling](https://kubernetes.io/docs/concepts/scheduling-eviction/)
- [RBAC authorization](https://kubernetes.io/docs/reference/access-authn-authz/rbac/)
- [Pod Security Standards](https://kubernetes.io/docs/concepts/security/pod-security-standards/)
- [Application troubleshooting](https://kubernetes.io/docs/tasks/debug/debug-application/)
