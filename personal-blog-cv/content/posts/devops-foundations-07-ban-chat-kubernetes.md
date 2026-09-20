---
title: "DevOps Foundations #7: Bản chất Kubernetes — desired state và reconciliation loop"
date: "2026-09-20"
summary: "Đi xuyên một yêu cầu tạo Deployment qua API server, etcd, scheduler, controller, kubelet để hiểu Kubernetes thực sự vận hành thế nào."
tags:
  - Kubernetes
  - DevOps Foundations
  - Containers
---

> Bài 7/12. Phần Kubernetes bắt đầu sau [Terraform cho teamwork](/blog/devops-foundations-06-terraform-teamwork).

Kubernetes không chỉ là nơi “chạy Docker container”. Nó là một hệ thống API và nhiều control loop liên tục đưa **actual state** về gần **desired state**. Nếu chỉ học YAML mà không hiểu vòng reconcile, khi Pod lỗi bạn sẽ không biết thành phần nào đang chịu trách nhiệm.

## Từ container đến orchestrator

Container đóng gói process cùng filesystem và dependency cần thiết. Nhưng một hệ thống nhiều container còn phải giải quyết:

- chạy ở node nào;
- khi process chết ai tạo lại;
- làm sao tìm các replica có IP thay đổi;
- rollout version mới thế nào;
- cấp config, secret và storage ra sao;
- giới hạn tài nguyên và quyền thế nào.

Kubernetes cung cấp API và controller cho các bài toán này. Nó không sửa bug trong application, không tự chọn resource hợp lý và không tự tạo observability đầy đủ.

## Object là record of intent

Một object thường có:

- `apiVersion`: phiên bản API;
- `kind`: loại object;
- `metadata`: tên, namespace, label, annotation;
- `spec`: trạng thái mong muốn;
- `status`: trạng thái hệ thống quan sát được.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web
spec:
  replicas: 3
  selector:
    matchLabels:
      app: web
  template:
    metadata:
      labels:
        app: web
    spec:
      containers:
        - name: web
          image: registry.example/web@sha256:abc123
          ports:
            - containerPort: 8080
```

Bạn không ra lệnh “tạo Pod 1, rồi Pod 2”. Bạn gửi intent “hãy duy trì ba replica theo template này”. Controller quan sát chênh lệch và hành động.

## Control plane và worker node

### API server

Là cửa vào của control plane. Nó xử lý authentication, authorization, admission và validation trước khi lưu object. `kubectl` chỉ là một client gọi API.

### etcd

Lưu dữ liệu API của cluster theo mô hình key-value nhất quán. Mất etcd hoặc backup không dùng được có thể đồng nghĩa mất desired state của cluster. Application data trong database của bạn không tự động nằm trong etcd.

### Scheduler

Tìm Pod chưa được gán node, lọc các node không phù hợp và chấm điểm node còn lại. Scheduler quyết định **nơi Pod nên chạy**; nó không trực tiếp khởi động container.

### Controller manager

Chạy nhiều controller. Mỗi controller theo dõi loại object và reconcile. Deployment controller, ReplicaSet controller, Job controller... phối hợp qua API thay vì gọi trực tiếp nhau theo một chuỗi cứng.

### Kubelet

Agent trên node. Kubelet theo dõi Pod đã được gán cho node của nó và làm việc với container runtime để container chạy đúng PodSpec. Nó báo status trở lại API.

### Container runtime và networking

Container runtime tạo/chạy container theo chuẩn được Kubernetes hỗ trợ. Network plugin thiết lập mạng Pod; service proxy hoặc data plane tương đương thực hiện routing Service tùy implementation.

## Điều gì xảy ra khi chạy `kubectl apply`?

Luồng đơn giản hóa:

1. `kubectl` gửi manifest đến API server.
2. API server xác thực identity, kiểm tra quyền, chạy admission và validate schema.
3. Object Deployment được lưu.
4. Deployment controller thấy desired replicas chưa tồn tại và tạo ReplicaSet.
5. ReplicaSet controller tạo Pod objects.
6. Scheduler thấy Pod chưa có node và ghi binding tới node phù hợp.
7. Kubelet trên node thấy Pod mới, yêu cầu runtime kéo image và chạy container.
8. Kubelet cập nhật Pod status; controller tiếp tục quan sát.

Mỗi bước là bất đồng bộ. Lệnh apply thành công không có nghĩa bước 8 đã hoàn tất.

## Reconciliation loop

Controller hoạt động gần với logic:

```text
quan sát actual state
so sánh với desired state
nếu lệch: thực hiện hành động nhỏ
cập nhật status
lặp lại
```

Nếu một Pod bị xóa, ReplicaSet controller thấy số replica thực tế nhỏ hơn mong muốn và tạo Pod khác. Kubernetes không “hồi sinh đúng container cũ”; nó tạo một instance mới để khôi phục invariant.

Đây là tư duy **cattle, not pets** cho workload stateless. Với stateful workload, dữ liệu và identity cần thiết kế riêng.

## Labels, selectors và ownership

Label là metadata dùng để nhóm và chọn object. Selector nối Deployment với Pod, Service với backend, NetworkPolicy với target.

```yaml
metadata:
  labels:
    app: web
    environment: production
```

Label sai có thể khiến Service không có endpoint hoặc controller không quản lý đúng Pod. Tên giống nhau không tạo quan hệ; selector và owner reference mới là cơ chế.

Owner reference giúp garbage collection hiểu object phụ thuộc. Xóa Deployment thường dẫn đến các ReplicaSet và Pod do nó sở hữu bị dọn theo policy.

## Namespace là gì và không phải gì?

Namespace tạo phạm vi tên và là điểm áp policy, quota, RBAC. Nó hữu ích để tổ chức workload. Nhưng namespace một mình không phải ranh giới cô lập hoàn chỉnh. Muốn multi-tenancy cần kết hợp RBAC, NetworkPolicy, quota, Pod Security, secret isolation và đôi khi cluster riêng.

## Declarative apply và imperative command

Imperative command hữu ích để khám phá hoặc debug:

```powershell
kubectl get pods
kubectl describe pod web-xxxxx
kubectl logs web-xxxxx
```

Desired state lâu dài nên nằm trong manifest/Helm/Kustomize và được version hóa. Nếu sửa trực tiếp object trong cluster nhưng không cập nhật nguồn chân lý, lần deploy/reconcile sau có thể ghi đè.

## Eventual consistency

Kubernetes không biến toàn cluster sang trạng thái mới trong một giao dịch nguyên tử. Các controller hội tụ dần. Trong lúc rollout, Pod cũ và mới có thể cùng tồn tại; status có thể thay đổi theo thời gian.

Vì vậy automation phải **wait theo condition**, không dùng `sleep 30` rồi đoán:

```powershell
kubectl rollout status deployment/web --timeout=120s
kubectl wait --for=condition=Ready pod -l app=web --timeout=120s
```

Wait thành công vẫn nên được nối với smoke test và metric của application.

## Bài thực hành

Trong cluster lab:

1. apply một Deployment ba replica;
2. dùng `kubectl get deployment,replicaset,pod -o wide` để thấy chuỗi ownership;
3. xóa một Pod;
4. quan sát Pod mới được tạo với tên/IP khác;
5. scale Deployment lên bốn replica;
6. dùng `kubectl describe` và events để giải thích hành động của controller.

Hãy tự nói lại thành lời: thành phần nào lưu intent, thành phần nào chọn node, thành phần nào chạy container, thành phần nào duy trì số replica.

## Chốt lại

Kubernetes là hệ thống điều khiển phân tán dựa trên API. Spec mô tả intent, status phản ánh quan sát, controller reconcile sai lệch, scheduler chọn node và kubelet hiện thực hóa Pod trên node. Khi hiểu luồng này, YAML trở thành cách diễn đạt mô hình thay vì một tập khóa cần học thuộc.

**Bài tiếp theo:** [DevOps Foundations #8: Pod, workload, probe và tài nguyên](/blog/devops-foundations-08-kubernetes-workloads)

---

Nguồn chính thức:

- [Kubernetes components](https://kubernetes.io/docs/concepts/overview/components/)
- [Objects in Kubernetes](https://kubernetes.io/docs/concepts/overview/working-with-objects/)
- [Kubernetes controllers](https://kubernetes.io/docs/concepts/architecture/controller/)
