import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';

// Cấu hình dotenv để đọc file .env từ thư mục gốc dự án (nếu có) hoặc thư mục backend
dotenv.config();
// Nếu .env ở thư mục gốc, có thể dùng: dotenv.config({ path: '../.env' });

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.BACKEND_PORT || 3001;

app.get('/', (req, res) => {
  res.send('Mood Weather Station Backend is running! 🐾');
});

app.post('/api/track-ip', async (req, res) => {
  // Lấy IP của người dùng
  const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;
  const { nickname, action } = req.body;

  const actionText = action === 'welcome' ? '🚀 BẮT ĐẦU HÀNH TRÌNH' : '💌 MỞ THƯ TÂM SỰ';
  console.log(`[Tracking] ${nickname || 'Ẩn danh'} - ${action}. IP: ${ip}`);

  let geoInfo = "";
  let mapsLink = "";

  // Thử lấy thông tin địa lý từ IP (sử dụng ipapi.co - miễn phí và hỗ trợ HTTPS)
  try {
    // Nếu là localhost thì bỏ qua
    if (ip !== '::1' && ip !== '127.0.0.1' && !ip.includes('192.168.')) {
      const geoRes = await fetch(`https://ipapi.co/${ip}/json/`);
      const geoData = await geoRes.json();
      
      if (!geoData.error) {
        const { city, region, country_name, latitude, longitude, org } = geoData;
        geoInfo = `📍 *Vị trí ước tính:* ${city}, ${region}, ${country_name}\n🏢 *Nhà mạng:* ${org}`;
        mapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
      }
    } else {
      geoInfo = `📍 *Vị trí:* Đang chạy trên Localhost`;
    }
  } catch (err) {
    console.error("Geo lookup failed:", err);
  }

  // Thông tin Telegram lấy từ biến môi trường
  const token = process.env.VITE_TELEGRAM_BOT_TOKEN;
  const chatId = process.env.VITE_TELEGRAM_CHAT_ID;

  if (token && chatId) {
    let text = `
✨ *THÔNG BÁO: ${actionText}*
--------------------------
👤 *Đối tượng:* ${nickname || 'Người dùng mới (Chưa nhập tên)'}
🌐 *IP Address:* \`${ip}\`
${geoInfo}
`.trim();

    if (mapsLink) {
      text += `\n🔗 [Xem trên Google Maps](${mapsLink})`;
    }

    text += `\n🕒 *Thời gian:* ${new Date().toLocaleString('vi-VN')}\n--------------------------\n_Ghi chú: Vị trí IP có độ chính xác tương đối (thường là trạm phát sóng)._`;

    try {
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: text,
          parse_mode: 'Markdown',
        }),
      });
    } catch (err) {
      console.error("Failed to send Telegram message:", err);
    }
  }

  res.status(200).json({ success: true });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
