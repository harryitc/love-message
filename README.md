# 🌈 Máy Dự báo Thời tiết Tâm trạng (Mood Weather Station) - V3.0

Dự án website tương tác cá nhân hóa cực kỳ tinh tế, dành riêng cho việc tạo bất ngờ và thấu hiểu "em gái nhỏ" (Huyền).

## 🚀 Tính năng Đặc sắc (V3.0 - Astro-Tracker Edition)

### 1. Astro-Tracker: "Chuyến xe Tình yêu" 🚀🧋
- **Hành trình Ultra-Live:** Theo dõi vị trí thực tế của bạn khi đang ship đồ ăn/nước uống cho Huyền qua bản đồ Live GPS.
- **Công nghệ WebSockets:** Cập nhật vị trí thời gian thực với độ trễ bằng 0, Mascot AstroCat trượt mượt mà trên bản đồ.
- **Custom Map:** Bản đồ Leaflet với phong cách Voyager dịu mắt, vẽ lộ trình bằng vết chân mèo hồng lãng mạn.
- **Thông báo Dashboard:** Tự động hiện radar lấp lánh trên màn hình của Huyền khi có một chuyến xe đang "bay" tới.

### 2. Công cụ cho Shipper (Bạn) 🗺️🔴
- **Smart Directions:** Nhập địa chỉ đích và mở ngay Google Maps Directions để được chỉ đường thực tế.
- **Live Recording:** Chỉ báo "Đang ghi lại kỷ niệm" giúp hành trình thêm phần ý nghĩa.
- **Astro-Simulator:** Trang mô phỏng tại `/ship-demo` để chạy thử nghiệm các lộ trình lãng mạn mà không cần di chuyển thật.

### 3. Báo cáo Tổng kết Telegram 🏁
- Ngay khi nhấn "Đã tới nơi", một báo cáo chuyên nghiệp sẽ được gửi về Telegram:
    - **Quãng đường:** Tính chính xác từng km (Haversine Formula).
    - **Thời gian:** Tổng phút di chuyển.
    - **Lộ trình:** Link Google Maps tổng hợp (Start -> End).
    - **Món quà & Lời nhắn.**

### 4. Hệ thống Mascot & Onboarding (Classic)
- **Astro Cat:** Mascot biết liếc mắt, thay đổi biểu cảm và "nói" tiếng Nga (*Красиво, Молодец, Вкусно*).
- **Security Gate:** Xác minh danh tính qua 4 bước hài hước để cá nhân hóa trải nghiệm.
- **Weather Forecast:** Dự báo thời tiết dựa trên GPS thực tế và tâm trạng của Huyền.

## 🛠 Công nghệ sử dụng
- **Frontend:** React 19, Vite, Tailwind CSS, Framer Motion, Leaflet.js, Socket.io-client.
- **Backend:** Node.js/Express, Socket.io (Real-time Engine).
- **API:** Open-Meteo (Thời tiết), Telegram Bot API, Google Maps Directions.

## 📖 Hướng dẫn Vận hành
- **Cài đặt:** Chạy `npm install` ở cả thư mục gốc và thư mục `backend`.
- **Chạy Server:** `npm run dev` (Frontend) và `npm start` (Backend).
- **Route quan trọng:**
    - `/`: Trang chính dành cho Huyền.
    - `/ship-love?mode=ship`: Bảng điều khiển của bạn khi đi ship.
    - `/ship-love`: Trang theo dõi của Huyền.
    - `/ship-demo`: Trang mô phỏng hành trình (Simulator).
    - `/demo`: Xem trước các biểu cảm của Mascot.

---
*Developed with ❤️ by Gemini CLI - Chúc bạn có những hành trình lãng mạn nhất!* 🐾✨
