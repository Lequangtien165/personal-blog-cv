---
title: "The Phoenix Project #2: Người giỏi nhất không nên là người duy nhất"
date: "2026-09-17"
summary: "Khi mọi việc quan trọng đều phụ thuộc vào một người, người hùng của đội cũng có thể trở thành rủi ro lớn nhất."
tags:
  - DevOps
  - Book Notes
  - Theory of Constraints
---

> Bài viết có tiết lộ nội dung từ chương 9 đến chương 16 của *The Phoenix Project*.

Ở phần đầu, Parts Unlimited đã rơi vào trạng thái ai cũng bận nhưng không ai nhìn thấy toàn bộ công việc. Sang chặng tiếp theo, Bill bắt đầu kiểm kê những gì IT đang gánh và phát hiện một vấn đề còn nguy hiểm hơn: gần như mọi việc quan trọng đều phải đi qua Brent.

## Nội dung phần này là gì?

Bill và đội ngũ tìm thấy một lượng lớn business project và internal IT project đang chạy đồng thời. Nhiều cam kết thậm chí không xuất hiện trong hệ thống quản lý chính thức. Chưa kịp xử lý hết danh sách này, họ vẫn phải tiếp nhận thay đổi mới, yêu cầu audit, lỗi production và áp lực ra mắt Phoenix.

Brent là kỹ sư hiểu hệ thống sâu nhất. Khi có sự cố khó, mọi người gọi Brent. Khi deployment gặp vấn đề, Brent được kéo vào. Khi một project cần quyết định kiến trúc hoặc cấu hình đặc biệt, Brent lại là người duy nhất có câu trả lời. Nhìn bên ngoài, Brent là người hùng giúp công ty vượt qua từng cuộc khủng hoảng. Nhưng nhìn ở cấp độ hệ thống, anh trở thành constraint: tốc độ của toàn bộ dòng công việc bị giới hạn bởi thời gian và sự chú ý của một người.

Lần triển khai Phoenix sau đó biến thành một cuộc chạy marathon đầy rủi ro. Các nhóm làm việc trong thời gian dài, nhiều bước phụ thuộc vào thao tác thủ công và thông tin chỉ tồn tại trong đầu một số cá nhân. Khi release thất bại, đội ngũ phải bỏ toàn bộ kế hoạch để phục hồi dịch vụ. Công việc dự kiến bị thay thế bởi firefighting.

Đến đây, Bill nhận ra bốn loại công việc mà IT phải xử lý:

1. Business projects.
2. Internal IT projects.
3. Changes.
4. Unplanned work.

Ba loại đầu có thể được lập kế hoạch. Loại cuối cùng xuất hiện khi hệ thống hỏng, deployment thất bại hoặc một vấn đề cũ quay trở lại. Unplanned work không chỉ chiếm thời gian; nó còn đẩy lùi mọi công việc đã cam kết và tạo thêm áp lực cho lần triển khai tiếp theo.

## Mình học được gì?

Bài học rõ nhất là **hero culture không phải dấu hiệu của một hệ thống khỏe mạnh**. Nếu một tổ chức luôn cần một người hùng để cứu production, nguyên nhân thật sự có thể là kiến thức không được chia sẻ, quy trình không được chuẩn hóa và hệ thống quá khó thay đổi an toàn.

Theo Theory of Constraints, cải thiện ở nơi không phải bottleneck sẽ không làm throughput chung tăng lên. Nếu mọi thay đổi vẫn chờ Brent, việc bổ sung người ở các nhóm khác có thể chỉ tạo thêm hàng đợi trước anh. Điều cần làm là bảo vệ thời gian của constraint, đảm bảo constraint xử lý công việc có giá trị cao nhất và từng bước đưa kiến thức ra khỏi đầu một cá nhân.

Mình cũng hiểu rõ hơn tác hại của unplanned work. Một giờ chữa cháy không chỉ mất một giờ. Nó còn làm gián đoạn task đang làm, kéo thêm người vào cuộc, tạo rework và khiến lịch trình sau đó tiếp tục trễ. Nếu technical debt không được xử lý, unplanned work sẽ ngày càng chiếm phần lớn năng lực của đội.

## Liên hệ với việc học DevOps

Trong project cá nhân hoặc nhóm nhỏ, bottleneck đôi khi chính là người duy nhất biết cách deploy, giữ credential, hiểu cấu hình DNS hoặc biết thứ tự khởi động service. Hệ thống vẫn có thể chạy, nhưng bus factor gần như bằng một.

Một số cách mình có thể áp dụng để giảm rủi ro này:

- Đưa cấu hình hạ tầng vào Terraform hoặc Ansible thay vì chỉ thao tác thủ công.
- Ghi lại quy trình deployment và rollback trong README hoặc runbook.
- Dùng CI/CD để các bước build, test và deploy có thể lặp lại.
- Lưu quyết định kỹ thuật trong repository thay vì để trong tin nhắn riêng.
- Tạo dashboard, alert và log đủ rõ để người khác cũng có thể bắt đầu điều tra.
- Dành thời gian xử lý technical debt thay vì chỉ chạy theo feature mới.

Automation ở đây không nhằm thay thế một người giỏi. Nó giúp biến kiến thức cá nhân thành năng lực chung của hệ thống và giải phóng người đó khỏi những thao tác lặp lại.

## Chốt lại

Brent là một kỹ sư xuất sắc, nhưng việc cả tổ chức phụ thuộc vào Brent là một lỗi thiết kế tổ chức. Người hùng có thể cứu một đêm triển khai; tài liệu, automation, chia sẻ kiến thức và quản lý constraint mới giúp hệ thống vận hành bền vững.

Phần này khiến mình thay đổi cách nhìn về năng suất. Câu hỏi không phải “ai đang làm việc chăm chỉ nhất?”, mà là “điểm nghẽn nằm ở đâu, nó đang xử lý việc gì và làm sao để toàn bộ hệ thống không còn phụ thuộc vào nó?”.

---

Nguồn tham khảo: [The Phoenix Project - Gene Kim, Kevin Behr và George Spafford](https://itrevolution.com/product/the-phoenix-project/).
