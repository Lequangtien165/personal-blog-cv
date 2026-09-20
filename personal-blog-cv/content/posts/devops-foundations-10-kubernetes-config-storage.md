---
title: "DevOps Foundations #10: Kubernetes Config, Secret và persistent storage"
date: "2026-09-20"
summary: "Tách image khỏi cấu hình, quản lý secret đúng ranh giới và hiểu PV, PVC, StorageClass cùng vòng đời dữ liệu."
tags:
  - Kubernetes
  - Storage
  - DevOps Foundations
---

> Bài 10/12. Nên đọc trước: [Kubernetes networking](/blog/devops-foundations-09-kubernetes-networking).

Container image nên bất biến giữa các môi trường. Config, secret và dữ liệu runtime không nên bị đóng cứng vào image. Kubernetes cung cấp các abstraction cho ba nhóm này, nhưng dùng sai có thể làm lộ secret hoặc mất dữ liệu khi Pod bị thay thế.

## Tách code, config, secret và data

- **Code/artifact:** image được build, scan và định danh bằng digest.
- **Config:** giá trị không bí mật, thay đổi theo môi trường.
- **Secret:** credential, token, key hoặc certificate cần kiểm soát truy cập.
- **Data:** trạng thái ứng dụng cần tồn tại qua vòng đời Pod.

Không dùng cùng một cơ chế cho tất cả. Environment variable không phải database; ConfigMap không phải secret manager; writable layer của container không phải persistent storage.

## ConfigMap

ConfigMap lưu key-value hoặc file cấu hình không bí mật:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: web-config
data:
  LOG_LEVEL: info
  app.properties: |
    feature.checkout=true
    timeout.seconds=5
```

Pod có thể nhận config qua environment variable, command argument hoặc mounted volume.

```yaml
env:
  - name: LOG_LEVEL
    valueFrom:
      configMapKeyRef:
        name: web-config
        key: LOG_LEVEL
```

Biến môi trường được chụp khi container khởi động; ConfigMap đổi không tự cập nhật biến trong process. Volume projection có thể được cập nhật sau một khoảng thời gian tùy cơ chế, nhưng application phải biết reload. Cách dễ dự đoán là version hóa config và rollout Pod khi config thay đổi.

## Secret không chỉ là base64

Kubernetes Secret dùng API riêng và giúp áp RBAC khác với ConfigMap. Nhưng dữ liệu trong manifest thường chỉ được base64 encode, **không phải mã hóa bảo mật**.

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: db-credentials
type: Opaque
stringData:
  username: app
  password: replace-in-secure-workflow
```

Không commit manifest chứa secret thật. Một thiết kế an toàn cần xét:

- mã hóa Secret at rest trong control plane;
- RBAC tối thiểu;
- không để app list/watch mọi Secret;
- secret manager bên ngoài khi phù hợp;
- rotation và revoke;
- tránh in secret vào log, command line hoặc CI output;
- audit ai đã đọc/thay đổi secret.

Đưa secret vào environment variable thuận tiện nhưng process dump hoặc debug có thể làm lộ. Mount file có thể phù hợp hơn cho certificate/credential và rotation, nhưng application vẫn phải reload đúng cách.

## ServiceAccount và workload identity

Pod chạy với một ServiceAccount. Không cấp cloud key dài hạn trong Secret nếu nền tảng hỗ trợ workload identity. Thay vào đó, ánh xạ ServiceAccount/identity của workload tới quyền cloud ngắn hạn và giới hạn theo namespace, account, audience hoặc role.

Không mount API credential nếu Pod không cần gọi Kubernetes API. Quyền của default ServiceAccount nên tối thiểu.

## Volume tạm thời

Một số volume sống cùng Pod:

- `emptyDir`: tạo khi Pod được gán node, dùng chia sẻ file giữa container; mất khi Pod bị xóa khỏi node;
- projected volume: ghép ConfigMap, Secret hoặc token;
- các volume node-local khác phụ thuộc node và có rủi ro riêng.

Restart container trong cùng Pod có thể vẫn thấy `emptyDir`, nhưng Pod mới thì không. Vì vậy không lưu dữ liệu nghiệp vụ cần bền vững trong đó.

## PV, PVC và StorageClass

Ba abstraction chính:

- **PersistentVolume (PV):** tài nguyên storage của cluster.
- **PersistentVolumeClaim (PVC):** yêu cầu storage của workload.
- **StorageClass:** mô tả lớp storage và provisioner dùng để cấp động.

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: app-data
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi
  storageClassName: fast
```

Pod mount claim:

```yaml
volumes:
  - name: data
    persistentVolumeClaim:
      claimName: app-data
containers:
  - name: app
    volumeMounts:
      - name: data
        mountPath: /var/lib/app
```

PVC tách yêu cầu của application khỏi chi tiết storage provider. Dynamic provisioning cho phép provisioner tạo volume khi claim xuất hiện.

## Access mode không phải permission model hoàn chỉnh

Các mode như `ReadWriteOnce`, `ReadOnlyMany`, `ReadWriteMany` mô tả khả năng mount theo semantics của storage/driver. Chúng không thay thế filesystem permission, application locking hoặc database consistency.

Đặc biệt, `ReadWriteOnce` thường liên quan việc mount read-write trên một node; nhiều Pod cùng node có thể có hành vi phụ thuộc driver. Nếu thật sự cần một Pod duy nhất, phải thiết kế controller và access mode phù hợp thay vì suy luận từ tên.

## Reclaim policy và vòng đời dữ liệu

Khi PVC/PV bị xóa, reclaim policy quyết định storage bên dưới được giữ hay xóa theo implementation. Với dữ liệu quan trọng, phải biết rõ:

- ai được phép xóa PVC;
- policy là Retain hay Delete;
- snapshot/backup nằm ở đâu;
- restore đã được thử chưa;
- backup có nhất quán với application không.

PV tồn tại không đồng nghĩa đã có backup. Replication cũng không phải backup: lỗi hoặc xóa nhầm có thể được replicate ngay.

## StatefulSet và stable identity

StatefulSet có thể tạo PVC riêng cho mỗi replica qua `volumeClaimTemplates`, cùng stable ordinal như `db-0`, `db-1`. Nhưng Kubernetes chỉ cung cấp primitive. Database vẫn cần logic replication, leader election, quorum, backup, failover và upgrade. Với hệ thống phức tạp, operator hoặc managed service có thể phù hợp hơn.

## Khi PVC Pending

Đi theo chuỗi:

1. `kubectl describe pvc <name>` và đọc events;
2. StorageClass có tồn tại và đúng tên không?
3. provisioner/CSI driver có chạy không?
4. quota, topology hoặc capacity có đủ không?
5. binding mode có chờ Pod được schedule không?
6. Pod có node affinity khiến không vùng nào phù hợp không?

Không sửa ngẫu nhiên access mode trước khi đọc lý do từ provisioner.

## Khi mount thành công nhưng app lỗi

Kiểm tra:

- path mount có che file sẵn trong image không;
- user/group trong container có quyền filesystem không;
- filesystem read-only hay full;
- volume có gắn đúng replica không;
- application có yêu cầu file lock hoặc format riêng không;
- log của CSI/node plugin có lỗi I/O không.

## Bài thực hành

1. deploy app đọc `LOG_LEVEL` từ ConfigMap;
2. đổi ConfigMap và chứng minh biến môi trường trong process chưa tự đổi;
3. rollout Pod và xác nhận config mới;
4. ghi file vào `emptyDir`, xóa Pod và quan sát dữ liệu mất;
5. lặp lại với PVC và xác nhận dữ liệu còn sau khi Pod được thay;
6. kiểm tra reclaim policy trước khi xóa claim trong lab.

Không đưa secret thật vào bài lab hoặc screenshot.

## Chốt lại

Image chứa code bất biến; ConfigMap chứa config không bí mật; Secret là API object nhạy cảm cần encryption và access control; PVC yêu cầu storage bền vững độc lập với Pod. Hiểu vòng đời của từng loại dữ liệu là điều kiện để rollout, rotation và recovery an toàn.

**Bài tiếp theo:** [DevOps Foundations #11: Scheduling, security và troubleshooting](/blog/devops-foundations-11-kubernetes-operations)

---

Nguồn chính thức:

- [ConfigMaps](https://kubernetes.io/docs/concepts/configuration/configmap/)
- [Secrets](https://kubernetes.io/docs/concepts/configuration/secret/)
- [Persistent Volumes](https://kubernetes.io/docs/concepts/storage/persistent-volumes/)
- [Storage Classes](https://kubernetes.io/docs/concepts/storage/storage-classes/)
