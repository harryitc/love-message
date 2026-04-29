# 🌈 Mood Weather Station - Hướng dẫn cho Gemini

## 🎯 Bối cảnh Dự án (Project Context) - CỰC KỲ QUAN TRỌNG
- **Đối tượng:** Website dành cho một người bạn nữ ("em gái nhỏ") mà người dùng đang theo đuổi.
- **Tình trạng mối quan hệ:** Hiện tại chỉ ở mức **giao tiếp lịch sự, khách sáo**. Đối phương chưa có tình cảm đặc biệt.
- **Sở thích đặc biệt:** Đối phương đang **học tiếng Nga**. Đây là yếu tố then chốt để cá nhân hóa nội dung (sử dụng từ vựng tiếng Nga, lời chào, hoặc các Easter Eggs liên quan đến văn hóa Nga).
- **Chiến thuật cốt lõi:** 
    - **Tinh tế & Không áp lực:** Tuyệt đối không sử dụng các từ ngữ quá sến súa, tỏ tình dồn dập hay các chức năng gây khó xử cho đối phương.
    - **Xây dựng sự tò mò:** Tạo ra một không gian thú vị, "vô tri" một cách thông minh và thể hiện sự quan tâm ngầm qua các chi tiết nhỏ.
    - **Cá nhân hóa cao:** Lồng ghép yếu tố học tiếng Nga một cách khéo léo để em ấy thấy mình được quan tâm đặc biệt.
    - **Hài hước & Nhẹ nhàng:** Ưu tiên các tương tác khiến em ấy mỉm cười hoặc cảm thấy thoải mái hơn sau một ngày mệt mỏi.
    - **Mục tiêu:** Chuyển đổi trạng thái từ "lịch sự" sang "tò mò và thích thú" thông qua trải nghiệm người dùng (UX).

## 🚀 Tính năng & Hiệu ứng Đặc sắc (V2.5 - Ultra Soft Edition)

### 1. Hệ thống Mascot AstroCat (Nâng cấp)
- **Biểu cảm đa dạng:** Có hiệu ứng má hồng (blush) khi vui, con ngươi xoay tròn (shook) khi bối rối, và tai mèo chuyển động theo nhịp.
- **Tương tác tiếng Nga:** Khi click vào Mascot, các từ vựng tiếng Nga ngắn gọn (như *Привет, Котик, Улыбка*) sẽ bay lên tại đúng vị trí click và mờ dần sau 2 giây.
- **Logic thông minh:** Biết hờn dỗi nếu người dùng bỏ trống thông tin trong form.

### 2. Quy trình "Ship Hoàng Hôn" (GPS Tracking)
- **Định vị tinh tế:** Tích hợp trong màn hình `Calibration` với lời dẫn lãng mạn: *"Mèo máy muốn ngắm bầu trời cùng em"*.
- **Giao diện Soft-Glass:** Popup xin quyền vị trí được thiết kế theo phong cách Glassmorphism hồng pastel, bo cong mềm mại, tạo cảm giác an tâm và dễ chịu.
- **Báo cáo Telegram:** Tự động gửi tọa độ GPS kèm link Google Maps về bot Telegram ngay khi em ấy đồng ý.

### 3. Hiệu ứng Thị giác & Ngôn ngữ
- **Floating Words:** Các từ tiếng Nga ý nghĩa bay bồng bềnh khắp màn hình ở cả trang `Welcome` và `Dashboard`. Hiệu ứng có độ đậm (70%) và đung đưa (sway) tự nhiên.
- **Looping Typing:** Dòng chữ *"Для тебя ♡"* tại trang chào mừng được lặp lại liên tục, tạo cảm giác lời nhắn nhủ luôn hiện hữu.
- **Russian Dialogue:** Mascot giao tiếp bằng cả tiếng Nga và tiếng Việt (*Красиво, Молодец, Вкусно*) xuyên suốt quy trình.

## 🛠 Lệnh điều khiển (Scripts)
- `npm run dev`: Chạy server phát triển.
- `npm run build`: Xây dựng dự án production.

## 📁 Cấu trúc Thư mục Quan trọng
- `src/components/AstroCat.jsx`: Trái tim của sự tương tác, quản lý Mascot và lời thoại ngẫu nhiên.
- `src/components/Calibration.jsx`: Quản lý logic Geolocation và giao diện xin quyền vị trí.
- `src/utils/telegram.js`: Xử lý gửi báo cáo tổng hợp về Bot (Info + GPS).

---
*Tài liệu này được cập nhật bởi Gemini CLI để đồng bộ với chiến thuật tán tỉnh tinh tế của bạn.*
