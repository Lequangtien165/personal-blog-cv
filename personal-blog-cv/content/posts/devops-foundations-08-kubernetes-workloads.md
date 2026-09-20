---
title: "DevOps Foundations #8: Kubernetes workloads — Pod, Deployment, probe và resources"
date: "2026-09-20"
summary: "Chọn đúng workload controller, hiểu vòng đời Pod và phân biệt startup, readiness, liveness cùng requests, limits."
tags:
  - Kubernetes
  - DevOps Foundations
  - Operations
---

> Bài 8/12. Nên đọc trước: [Bản chất Kubernetes](/blog/devops-foundations-07-ban-chat-kubernetes).

Pod là đơn vị compute nhỏ nhất có thể deploy trong Kubernetes, nhưng hiếm khi nên tạo Pod trần. Controller mới là thành phần giữ workload tồn tại, rollout và scale theo desired state.

## Pod không đồng nghĩa container

Một Pod có thể chứa một hoặc nhiều container cùng chia sẻ:

- network namespace và IP;
- `localhost`;
- volume được khai báo trong Pod;
- vòng đời scheduling.

Mô hình phổ biến là một application container chính. Sidecar chỉ hợp lý khi hai process phải cùng lifecycle và chia sẻ tài nguyên chặt, ví dụ proxy hoặc agent phụ trợ. Đừng gom nhiều service độc lập vào một Pod vì chúng sẽ không scale và deploy độc lập được.

Pod là tạm thời. Khi bị thay thế, Pod mới thường có tên và IP khác. Đừng lưu identity quan trọng trong Pod IP.

## Chọn workload controller

### Deployment

Cho application stateless với các replica có thể thay thế lẫn nhau. Deployment quản lý ReplicaSet và hỗ trợ rolling update/rollback revision.

### StatefulSet

Cho workload cần stable network identity, thứ tự hoặc storage gắn ổn định. StatefulSet không tự làm database trở nên an toàn; replication, backup, quorum và restore vẫn thuộc thiết kế của database/operator.

### DaemonSet

Đảm bảo Pod chạy trên các node phù hợp, thường dùng cho log agent, monitoring agent hoặc thành phần node-level.

### Job và CronJob

Job chạy nhiệm vụ đến khi hoàn thành. CronJob tạo Job theo lịch. Cần thiết kế idempotency vì retry hoặc overlap có thể xảy ra; đặt concurrency policy và deadline phù hợp.

## Container lifecycle và restart

Kubelet restart container trong Pod theo `restartPolicy`. Nhưng Pod có thể bị controller thay thế hoàn toàn khi node mất, rollout hoặc eviction. Dữ liệu chỉ nằm trong writable layer của container sẽ mất khi container/Pod bị thay.

Khi thấy `CrashLoopBackOff`, đó là cơ chế backoff sau nhiều lần container start rồi exit, không phải nguyên nhân gốc. Hãy xem exit code, current log và previous log:

```powershell
kubectl describe pod <pod-name>
kubectl logs <pod-name> -c <container-name>
kubectl logs <pod-name> -c <container-name> --previous
```

## Ba loại probe

### Startup probe

Dành cho ứng dụng khởi động chậm. Cho đến khi startup probe thành công, liveness và readiness chưa làm ảnh hưởng theo cách thông thường. Nó ngăn liveness giết ứng dụng trước khi khởi động xong.

### Readiness probe

Trả lời: “instance này có nên nhận traffic từ Service không?”. Khi fail, Pod thường vẫn chạy nhưng bị loại khỏi backend sẵn sàng. Readiness không tự restart container.

### Liveness probe

Trả lời: “process này có mắc kẹt đến mức cần restart không?”. Khi fail đủ ngưỡng, kubelet restart container.

Không dùng cùng một probe hời hợt cho cả ba. Nếu liveness phụ thuộc database, một lần database lỗi có thể làm toàn bộ application replica cùng restart và tăng tải trong lúc sự cố.

```yaml
containers:
  - name: web
    image: registry.example/web@sha256:abc123
    ports:
      - name: http
        containerPort: 8080
    startupProbe:
      httpGet:
        path: /startup
        port: http
      periodSeconds: 5
      failureThreshold: 30
    readinessProbe:
      httpGet:
        path: /ready
        port: http
      periodSeconds: 5
      failureThreshold: 3
    livenessProbe:
      httpGet:
        path: /live
        port: http
      periodSeconds: 10
      failureThreshold: 3
```

Các ngưỡng trên chỉ minh họa. Phải đo thời gian khởi động và hành vi thật để đặt timeout/threshold.

## Requests và limits

**Request** là lượng tài nguyên scheduler dùng để tìm node và là phần workload được bảo đảm theo mô hình scheduling.

**Limit** là trần runtime. Với memory, vượt limit có thể khiến container bị OOM kill. Với CPU, container thường bị throttle thay vì bị kill.

```yaml
resources:
  requests:
    cpu: "100m"
    memory: "128Mi"
  limits:
    cpu: "500m"
    memory: "256Mi"
```

Không đặt request khiến scheduler không có tín hiệu tốt và cluster dễ overcommit ngoài ý muốn. Đặt request quá cao làm Pod Pending dù node có thể còn usage thực tế thấp. Đặt memory limit quá thấp tạo OOM; CPU limit quá chặt có thể tăng latency do throttling.

Sizing nên dựa trên metric theo percentile và load test, có headroom, rồi quan sát sau deploy.

## QoS và eviction

Kubernetes phân loại Pod dựa trên requests/limits thành các lớp QoS. Khi node thiếu tài nguyên, QoS và mức usage so với request ảnh hưởng thứ tự eviction. Nhưng QoS không thay thế capacity planning.

Pod có thể bị eviction vì memory/disk pressure, taint hoặc chính sách khác. Khi Pod Pending hay Evicted, đọc `status.reason`, condition và events thay vì chỉ restart.

## Rolling update

Deployment dùng `maxUnavailable` và `maxSurge` để cân bằng availability và tài nguyên tạm thời:

```yaml
strategy:
  type: RollingUpdate
  rollingUpdate:
    maxUnavailable: 0
    maxSurge: 1
```

`maxUnavailable: 0` không đảm bảo zero downtime nếu readiness sai, capacity không đủ, application không tương thích hoặc dependency lỗi. Nó chỉ là một phần của chiến lược.

Theo dõi rollout:

```powershell
kubectl rollout status deployment/web --timeout=120s
kubectl rollout history deployment/web
kubectl get pods -l app=web -w
```

## Init container và sidecar

Init container chạy tuần tự trước application container, phù hợp chuẩn bị file hoặc chờ điều kiện hữu hạn. Không dùng vòng chờ vô hạn để che dependency thiếu; cần timeout và log rõ.

Sidecar chạy cùng Pod và hỗ trợ container chính. Sidecar tiêu thụ resource và có failure mode riêng, nên cũng cần request/limit và observability.

## Debug theo trạng thái

- **Pending:** xem events; thường do resource, selector/affinity, taint, PVC hoặc image pull secret.
- **ImagePullBackOff:** kiểm tra image name/digest, registry auth, network và rate limit.
- **CrashLoopBackOff:** xem exit code, `--previous`, config/secret và probe.
- **Running nhưng NotReady:** kiểm tra readiness endpoint, port, dependency và events.
- **OOMKilled:** xem last state, memory metric, leak/spike và limit; không chỉ tăng limit mà không tìm nguyên nhân.

## Bài thực hành

1. deploy một ứng dụng hai replica với readiness;
2. làm readiness fail nhưng giữ process sống và xác nhận Pod bị loại khỏi Service backend;
3. làm liveness fail và quan sát restart count;
4. đặt memory limit thấp trong lab để quan sát `OOMKilled`;
5. sửa cấu hình, rollout và xác minh endpoint.

Ghi lại events, logs, restart count và rollout status cho từng thí nghiệm.

## Chốt lại

Controller duy trì workload, probe quyết định trạng thái phục vụ hoặc restart, còn requests/limits ảnh hưởng scheduling và runtime. Ba nhóm này tương tác trực tiếp: probe sai gây restart, request sai gây Pending, limit sai gây throttle/OOM. Vận hành Kubernetes là đọc đúng tín hiệu của từng lớp.

**Bài tiếp theo:** [DevOps Foundations #9: Kubernetes networking từ Pod IP đến Gateway](/blog/devops-foundations-09-kubernetes-networking)

---

Nguồn chính thức:

- [Kubernetes workload management](https://kubernetes.io/docs/concepts/workloads/controllers/)
- [Configure probes](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/)
- [Resource management for Pods and containers](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/)
