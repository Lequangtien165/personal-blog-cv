---
title: "DevOps Foundations #9: Kubernetes networking — Pod IP, Service, DNS và Gateway"
date: "2026-09-20"
summary: "Theo dấu một request qua DNS, Service, EndpointSlice và Pod; hiểu CNI, Ingress/Gateway cùng NetworkPolicy."
tags:
  - Kubernetes
  - Networking
  - DevOps Foundations
---

> Bài 9/12. Nên đọc trước: [Kubernetes workloads](/blog/devops-foundations-08-kubernetes-workloads).

Networking là nơi nhiều lỗi Kubernetes bị gọi chung là “Service không vào được”. Muốn debug, phải biết request đang ở lớp nào: DNS, Service selection, endpoint, route, port, application hay policy.

## Kubernetes network model

Mô hình cơ bản:

- mỗi Pod có IP riêng trong cluster;
- các container trong cùng Pod dùng chung network namespace và nói chuyện qua `localhost`;
- Pod-to-Pod communication do cluster network/CNI implementation cung cấp;
- Service tạo endpoint ổn định trước một tập Pod thay đổi;
- network policy kiểm soát luồng nếu plugin thực thi hỗ trợ.

Pod IP là tạm thời. Client không nên giữ danh sách Pod IP; hãy gọi Service hoặc một cơ chế discovery phù hợp.

## CNI làm gì?

Kubernetes định nghĩa mô hình và giao diện; network plugin hiện thực mạng Pod. Tùy plugin, data plane có thể dựa trên iptables, IPVS, eBPF hoặc cơ chế khác. Vì vậy cùng manifest NetworkPolicy nhưng cluster dùng plugin không hỗ trợ enforcement thì policy có thể không có tác dụng.

Khi debug phải biết implementation thật, không chỉ biết API object tồn tại.

## Service và selector

Service chọn Pod qua label selector và cung cấp virtual IP/DNS ổn định:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: web
spec:
  selector:
    app: web
  ports:
    - name: http
      port: 80
      targetPort: http
```

Luồng logic:

```text
client -> DNS web -> Service port 80 -> EndpointSlice -> ready Pod:targetPort
```

EndpointSlice được cập nhật theo Pod phù hợp và sẵn sàng. Nếu selector sai, Service vẫn tồn tại và DNS vẫn resolve nhưng không có backend.

Kiểm tra theo lớp:

```powershell
kubectl get service web
kubectl get endpointslice -l kubernetes.io/service-name=web
kubectl get pods -l app=web --show-labels
```

## `port`, `targetPort` và `containerPort`

- `port`: cổng client gọi trên Service.
- `targetPort`: cổng Service chuyển đến ở Pod.
- `containerPort`: metadata mô tả cổng container; không tự expose ra ngoài.

Application phải thực sự listen đúng interface và cổng. Nếu process chỉ bind `127.0.0.1` bên trong container, traffic từ Pod network có thể không vào được dù manifest trông đúng.

## Các loại Service

- **ClusterIP:** chỉ có endpoint ổn định trong cluster; mặc định.
- **NodePort:** mở một port trên node và chuyển vào Service; thường là building block hơn là trải nghiệm edge hoàn chỉnh.
- **LoadBalancer:** yêu cầu integration/controller tạo hoặc cấu hình load balancer bên ngoài.
- **ExternalName:** ánh xạ tên Service sang DNS name ngoài cluster; không tạo proxy backend như Service selector thông thường.
- **Headless Service:** không có ClusterIP, DNS trả về địa chỉ backend; thường dùng khi client cần discovery từng instance.

`type: LoadBalancer` không tự tạo load balancer nếu môi trường không có implementation tương ứng.

## DNS trong cluster

Service có tên dạng đầy đủ gần như:

```text
web.production.svc.cluster.local
```

Pod cùng namespace có thể gọi `web`; namespace khác dùng `web.production` hoặc FQDN. Search domain giúp tên ngắn hoạt động nhưng cũng có thể gây nhầm khi namespace sai.

Debug DNS từ một Pod:

```powershell
kubectl exec <debug-pod> -- nslookup web.production.svc.cluster.local
```

Nếu default-deny egress, nhớ cho phép traffic tới DNS của cluster; nếu không, mọi lỗi có thể trông như application/network bị hỏng.

## Ingress và Gateway API

Ingress mô tả HTTP/HTTPS routing từ ngoài cluster vào Service, nhưng cần **Ingress controller**. Chỉ tạo object Ingress không làm traffic tự chảy.

Kubernetes hiện khuyến nghị Gateway API cho khả năng mới; Ingress API đã frozen nhưng vẫn được hỗ trợ. Gateway API tách vai trò tốt hơn qua GatewayClass, Gateway và route như HTTPRoute. Nó cũng cần CRD/controller implementation phù hợp.

Luồng edge điển hình:

```text
public DNS -> load balancer/Gateway -> HTTPRoute/Ingress rule
           -> Service -> EndpointSlice -> ready Pod
```

TLS có thể terminate ở gateway/ingress, service mesh hoặc application tùy kiến trúc. Phải biết certificate nằm ở đâu và đoạn nào còn plaintext.

## NetworkPolicy

NetworkPolicy chọn Pod và mô tả ingress/egress được phép ở L3/L4. Policy là additive: các allow rule phù hợp được hợp lại; không có thứ tự rule kiểu firewall truyền thống.

Default deny ingress:

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-ingress
spec:
  podSelector: {}
  policyTypes:
    - Ingress
```

Sau default deny, phải thêm allow cho luồng hợp lệ. Với egress, cần xem DNS, API ngoài, database và telemetry. NetworkPolicy cơ bản không thay thế WAF, TLS policy hay authorization ở tầng ứng dụng.

## Quy trình debug request không tới Pod

1. Client resolve DNS đúng địa chỉ không?
2. Gateway/Ingress có controller, address và rule đúng không?
3. Service có đúng port/targetPort không?
4. EndpointSlice có ready endpoint không?
5. Label selector có khớp Pod không?
6. Pod Ready không và process có listen `0.0.0.0:<port>` không?
7. NetworkPolicy ở cả source egress và destination ingress có cho phép không?
8. CNI/data plane có lỗi trên node không?
9. Application log có nhận request và trả lỗi tầng HTTP không?

Test từ gần tới xa: gọi `localhost` trong Pod, gọi Pod IP từ debug Pod, gọi Service DNS, rồi gọi từ ngoài qua Gateway. Cách này xác định đoạn bị đứt.

## Bài thực hành

1. deploy hai replica `web` với label `app: web`;
2. tạo ClusterIP Service và gọi bằng DNS từ debug Pod;
3. sửa selector để EndpointSlice rỗng, quan sát lỗi rồi sửa lại;
4. áp default-deny trong namespace;
5. thêm allow policy tối thiểu cho client đến web và DNS;
6. ghi evidence ở từng lớp: DNS result, EndpointSlice, Pod readiness và response.

## Chốt lại

Service không phải Pod và Ingress/Gateway không phải Service. Mỗi lớp tạo một abstraction riêng: CNI nối Pod, Service ổn định discovery, EndpointSlice liệt kê backend, Gateway/Ingress xử lý edge routing, NetworkPolicy giới hạn luồng. Debug hiệu quả là đi qua từng lớp thay vì đổi manifest ngẫu nhiên.

**Bài tiếp theo:** [DevOps Foundations #10: Config, Secret và persistent storage](/blog/devops-foundations-10-kubernetes-config-storage)

---

Nguồn chính thức:

- [Kubernetes services, load balancing and networking](https://kubernetes.io/docs/concepts/services-networking/)
- [DNS for Services and Pods](https://kubernetes.io/docs/concepts/services-networking/dns-pod-service/)
- [Gateway API](https://kubernetes.io/docs/concepts/services-networking/gateway/)
- [NetworkPolicy](https://kubernetes.io/docs/concepts/services-networking/network-policies/)
