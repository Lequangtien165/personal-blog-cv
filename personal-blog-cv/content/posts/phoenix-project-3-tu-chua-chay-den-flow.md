---
title: "The Phoenix Project #3: Từ chữa cháy đến tạo flow"
date: "2026-09-18"
summary: "Parts Unlimited bắt đầu thoát khỏi hỗn loạn khi giới hạn WIP, bảo vệ constraint và đưa feedback vào toàn bộ dòng chảy Dev-Ops-Security."
tags:
  - DevOps
  - Book Notes
  - Flow
---

> Bài viết có tiết lộ nội dung từ chương 17 đến chương 29 của *The Phoenix Project*.

Sau thất bại của Phoenix, Parts Unlimited không thể tiếp tục làm việc theo cách cũ. Chặng này là phần mình thấy “DevOps” bắt đầu hiện ra rõ nhất: không phải tên một team hay bộ công cụ, mà là cách tổ chức lại dòng công việc từ business đến Development, Operations và Security.

## Nội dung phần này là gì?

Bill quay lại và cùng nhóm lãnh đạo IT nhìn thẳng vào năng lực thực tế của hệ thống. Họ dừng nhận thêm việc một cách vô điều kiện, kiểm kê các cam kết, xếp lại ưu tiên và làm cho work in progress hiển thị trên bảng công việc.

Thay vì để hàng chục project cùng tranh giành tài nguyên, đội ngũ bắt đầu chọn một số ít công việc quan trọng nhất. Brent được bảo vệ khỏi các yêu cầu ngẫu nhiên để tập trung vào constraint. Những kiến thức chỉ Brent nắm giữ được chuyển thành quy trình, tài liệu và khả năng của các kỹ sư khác.

Bill cũng nhận ra thời gian thực hiện một thao tác thường không phải phần lớn nhất của lead time. Công việc có thể chỉ cần vài phút để xử lý nhưng phải chờ nhiều ngày trong queue. Nó cũng có thể bị trả ngược về vì thiếu thông tin, gặp lỗi hoặc chưa đáp ứng yêu cầu của nhóm tiếp theo. Muốn tăng flow, đội ngũ phải nhìn thấy cả thời gian chờ và rework, không chỉ thời gian “đang làm”.

Security và audit cũng thay đổi vai trò. Thay vì xuất hiện cuối quy trình với một danh sách kiểm soát khiến release bị chặn, các yêu cầu này được liên kết với mục tiêu kinh doanh và đưa vào dòng công việc sớm hơn. Development, Operations và Security bắt đầu chia sẻ cùng một kết quả thay vì tối ưu các chỉ số riêng.

Đó là cách First Way và Second Way dần trở thành hành động:

- **First Way:** tạo dòng chảy nhanh và ổn định từ Development qua Operations đến khách hàng.
- **Second Way:** tạo feedback nhanh theo chiều ngược lại để phát hiện lỗi sớm, sửa tại nguồn và tránh lặp lại.

## Mình học được gì?

Điều đầu tiên là **giới hạn WIP không làm đội ngũ chậm lại**. Nó giúp hoàn tất công việc sớm hơn bằng cách giảm context switching, hàng đợi và sự cạnh tranh tài nguyên. Bắt đầu nhiều việc tạo cảm giác tiến bộ; hoàn thành và đưa giá trị đến người dùng mới là tiến bộ thật.

Điều thứ hai là **feedback càng muộn thì chi phí sửa lỗi càng cao**. Nếu lỗi cấu hình chỉ được phát hiện khi deploy production, đội ngũ phải điều tra trong áp lực. Nếu cùng lỗi đó bị bắt ở bước validate, test hoặc staging, việc sửa sẽ nhanh và ít rủi ro hơn.

Điều thứ ba là **outcome quan trọng hơn việc tuân thủ quy trình một cách máy móc**. Change management, security hay audit đều cần thiết, nhưng mục tiêu của chúng phải là làm hệ thống an toàn và đáng tin cậy hơn. Một biểu mẫu được điền đầy đủ nhưng không giúp phát hiện rủi ro thì chỉ tạo thêm queue.

Cuối cùng, DevOps yêu cầu **mục tiêu chung**. Nếu Development được thưởng vì hoàn thành nhiều feature còn Operations chỉ bị đánh giá theo uptime, hai nhóm rất dễ xung đột. Khi cùng chịu trách nhiệm về thời gian đưa thay đổi đến người dùng, tỷ lệ lỗi và tốc độ phục hồi, họ mới có lý do để cải thiện toàn bộ value stream.

## Liên hệ với việc học DevOps

Một pipeline CI/CD tốt có thể biến các bài học trên thành feedback cụ thể:

1. Developer tạo pull request.
2. Pipeline chạy test và kiểm tra chất lượng.
3. Image được build một lần và gắn version rõ ràng.
4. Security scan diễn ra trước deployment.
5. Cùng artifact được đưa qua các môi trường.
6. Health check và metric xác nhận trạng thái sau deploy.
7. Nếu kiểm chứng thất bại, quy trình rollback được kích hoạt.

Mục tiêu không phải thêm càng nhiều stage càng tốt. Mỗi stage phải trả lời một câu hỏi rủi ro và đưa feedback đủ sớm để người tạo thay đổi có thể hành động.

Với project hạ tầng, mình cũng có thể đo những thứ ngoài build time: một thay đổi chờ review bao lâu, deployment phải chờ môi trường bao lâu, lỗi thường bị phát hiện ở bước nào và thời gian phục hồi sau một lần deploy hỏng. Những con số đó giúp nhìn thấy flow thật thay vì chỉ nhìn trạng thái xanh hoặc đỏ của pipeline.

## Chốt lại

Parts Unlimited bắt đầu thoát khỏi vòng lặp chữa cháy khi ngừng tối ưu từng silo và bắt đầu quản lý toàn bộ dòng giá trị. Họ giới hạn công việc đang làm, bảo vệ constraint, giảm thời gian chờ và đưa feedback về gần nơi tạo ra thay đổi.

Với mình, đây là phần chuyển DevOps từ một danh sách công cụ thành một mô hình vận hành: flow phải đi về phía khách hàng, feedback phải quay về thật nhanh và mọi nhóm phải cùng chịu trách nhiệm cho kết quả cuối cùng.

---

Nguồn tham khảo: [The Phoenix Project - Gene Kim, Kevin Behr và George Spafford](https://itrevolution.com/product/the-phoenix-project/).
