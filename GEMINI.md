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

## 🚀 Tổng quan Dự án
- **Mục tiêu:** Tạo một website tương tác để "thấu hiểu" tâm trạng người dùng (đặc biệt là phái nữ) qua các câu hỏi hài hước và Mascot dễ thương.
- **Công nghệ chính:** React (Vite), Tailwind CSS, Framer Motion (Animation), Lucide React (Icons).
- **Kiến trúc:** Ứng dụng Single Page Application (SPA) quản lý trạng thái qua các bước (steps) trong `App.jsx`.

## 🛠 Lệnh điều khiển (Scripts)
- `npm run dev`: Chạy server phát triển (mặc định tại `http://localhost:5173`).
- `npm run build`: Xây dựng dự án cho môi trường production.
- `npm run lint`: Kiểm tra lỗi code bằng ESLint.
- `npm run preview`: Xem trước bản build production.

## 📁 Cấu trúc Thư mục Quan trọng
- `src/components/`: Chứa các thành phần giao diện chính.
  - `AstroCat.jsx`: Mascot chính, có logic theo dõi chuột và thay đổi biểu cảm.
  - `SecurityGate.jsx`: Quy trình onboarding 4 bước để thu thập thông tin.
- `src/hooks/useSound.js`: Quản lý âm thanh (BGM và SFX) sử dụng `useRef` và `Audio` API.
- `src/utils/telegram.js`: Gửi thông tin người dùng về Telegram Bot (silent notification).
- `public/sounds/`: Chứa các tệp âm thanh định dạng `.mp3` và `.wav`.

## 🎨 Quy ước Phát triển
- **Styling:** Sử dụng Tailwind CSS với phong cách Glassmorphism. Các màu custom trong `tailwind.config.js`: `mood-pink`, `mood-blue`, `mood-purple`.
- **Animation:** Ưu tiên sử dụng `framer-motion` cho các hiệu ứng chuyển cảnh và Mascot.
- **State Persistence:** Sử dụng `localStorage` để lưu lại bước hiện tại (`appStep`) và dữ liệu người dùng (`userData`), giúp duy trì trạng thái khi refresh trang.
- **Environment Variables:** Cần file `.env` chứa:
  - `VITE_TELEGRAM_BOT_TOKEN`: Token của Telegram Bot.
  - `VITE_TELEGRAM_CHAT_ID`: ID của chat/channel nhận thông báo.

## 💡 Lưu ý đặc biệt
- **Demo Mode:** Truy cập trực tiếp vào `/demo` để xem Mascot mà không cần qua quy trình onboarding.
- **Mascot Interaction:** `AstroCat` có thể nhận các props `state` (`idle`, `thinking`, `happy`, `shook`) và `mousePos` để điều khiển hướng mắt nhìn.
- **Telegram Notification:** Hệ thống gửi thông báo ngầm ngay sau khi hoàn thành `SecurityGate`. Hãy kiểm tra kết nối mạng và biến môi trường nếu tính năng này không hoạt động.

---
*Tài liệu này được tạo bởi Gemini CLI để hỗ trợ quá trình phát triển dự án.*
