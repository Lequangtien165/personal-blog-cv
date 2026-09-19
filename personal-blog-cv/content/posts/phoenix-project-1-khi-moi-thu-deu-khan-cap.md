---
title: "The Phoenix Project #1: Khi mọi thứ đều khẩn cấp"
date: "2026-09-16"
summary: "Bill tiếp quản một hệ thống đang hỗn loạn và nhận ra rằng vấn đề đầu tiên của IT không phải thiếu công cụ, mà là không nhìn thấy công việc."
tags:
  - DevOps
  - Book Notes
  - Operations
---

> Bài viết có tiết lộ nội dung từ chương 1 đến chương 8 của *The Phoenix Project*.

Đây là bài đầu tiên trong chuỗi bốn bài mình ghi lại sau khi đọc *The Phoenix Project*. Điều khiến mình chú ý ngay từ đầu là cuốn sách không mở màn bằng Docker, Kubernetes hay một pipeline đẹp mắt. Nó bắt đầu bằng một cuộc khủng hoảng rất quen thuộc với người làm IT: hệ thống gặp sự cố, mọi người cùng lao vào chữa cháy, nhưng không ai thực sự biết toàn bộ chuyện gì đang xảy ra.

## Nội dung phần này là gì?

Bill Palmer đang phụ trách một nhóm vận hành tương đối ổn định thì bất ngờ được đưa lên vị trí VP of IT Operations tại Parts Unlimited. Anh không có thời gian làm quen với vai trò mới. Ngay ngày đầu tiên, hệ thống payroll gặp sự cố nghiêm trọng, dữ liệu nhân viên bị xử lý sai và hàng loạt bộ phận cùng gây áp lực lên IT.

Trong lúc đội vận hành còn đang tìm nguyên nhân, Bill phải tiếp nhận thêm Phoenix - dự án được ban lãnh đạo xem là cơ hội sống còn của công ty. Dự án đã trễ, vượt ngân sách và có quá nhiều phụ thuộc chưa được kiểm soát. Development muốn phát hành nhanh, Operations lo hệ thống không chịu nổi, Security xuất hiện với thêm yêu cầu, còn phía business chỉ quan tâm ngày ra mắt.

Vấn đề không nằm ở việc mọi người lười biếng. Ngược lại, ai cũng bận và thường xuyên làm việc ngoài giờ. Nhưng công việc đến từ quá nhiều nơi: cuộc họp, email, điện thoại, yêu cầu miệng, sự cố và những cam kết không được ghi lại. Không có một bức tranh chung về tổng lượng công việc, mức độ ưu tiên hay năng lực thực tế của đội ngũ.

Khi gặp Erik tại nhà máy, Bill bắt đầu được gợi ý rằng công việc IT có thể được nhìn giống như dòng chảy trong sản xuất. Nếu thả quá nhiều việc vào hệ thống cùng lúc, hàng đợi sẽ dài ra, thời gian chờ tăng lên và mọi cam kết đều trở nên khó đoán. Đây là lúc câu chuyện chuyển từ “làm sao xử lý sự cố này?” sang câu hỏi quan trọng hơn: “hệ thống làm việc nào đã tạo ra những sự cố lặp đi lặp lại như vậy?”.

## Mình học được gì?

Bài học đầu tiên là **bận rộn không đồng nghĩa với tạo ra giá trị**. Một đội có thể làm việc hết công suất nhưng kết quả chung vẫn chậm nếu mỗi người đang tối ưu một việc khác nhau. Development hoàn thành code chưa có nghĩa là khách hàng nhận được giá trị. Operations giữ một máy chủ hoạt động chưa chắc đã giúp dự án quan trọng nhất tiến lên.

Bài học thứ hai là **công việc vô hình rất khó quản lý**. Nếu không biết đội đang xử lý bao nhiêu yêu cầu, không thể trả lời chính xác khi nào một thay đổi sẽ hoàn tất. Việc liên tục nhận thêm nhiệm vụ chỉ làm tăng work in progress, kéo dài thời gian chờ và khiến kế hoạch mất ý nghĩa.

Bài học thứ ba là **ổn định vận hành không tách rời mục tiêu kinh doanh**. Sự cố payroll không chỉ là một lỗi kỹ thuật. Nó ảnh hưởng trực tiếp đến nhân viên, tài chính và niềm tin dành cho cả công ty. Phoenix cũng không đơn thuần là một bản release; nó là nỗ lực để Parts Unlimited cạnh tranh trên thị trường.

## Liên hệ với việc học DevOps

Khi làm project cá nhân, mình thường có xu hướng bắt đầu bằng việc chọn công cụ: Terraform hay Ansible, Jenkins hay GitHub Actions, EC2 hay EKS. Phần đầu của cuốn sách nhắc mình lùi lại một bước và trả lời những câu hỏi cơ bản hơn:

- Dịch vụ này tạo giá trị gì và cho ai?
- Những công việc nào đang được thực hiện?
- Ai chịu trách nhiệm cho từng phần?
- Thay đổi nào đang chờ và thay đổi nào có rủi ro cao?
- Khi hệ thống lỗi, tín hiệu đầu tiên đến từ đâu?

Trong một project nhỏ, “làm cho công việc hiển thị” có thể chỉ là một backlog rõ ràng, giới hạn số task đang làm, sơ đồ dependency, change log và runbook xử lý sự cố. Monitoring cũng không nên được thêm vào cuối cùng chỉ để có dashboard; nó phải giúp trả lời hệ thống đang khỏe hay không và thay đổi vừa triển khai có gây tác động gì không.

## Chốt lại

Phần đầu của *The Phoenix Project* cho thấy hỗn loạn trong IT hiếm khi đến từ một lỗi duy nhất. Nó thường là kết quả của quá nhiều việc cùng lúc, trách nhiệm không rõ ràng, thay đổi thiếu kiểm soát và các nhóm theo đuổi mục tiêu riêng.

Trước khi nói đến automation hay continuous delivery, việc đầu tiên cần làm là nhìn thấy công việc, hiểu dòng chảy và ổn định hệ thống. Nếu chưa biết công việc đi vào từ đâu, đang mắc lại ở đâu và phục vụ mục tiêu nào, thêm một công cụ mới chỉ có thể giúp chúng ta tạo ra sự hỗn loạn nhanh hơn.

---

Nguồn tham khảo: [The Phoenix Project - Gene Kim, Kevin Behr và George Spafford](https://itrevolution.com/product/the-phoenix-project/).
