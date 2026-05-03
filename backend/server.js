import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import { createServer } from 'http';
import { Server } from 'socket.io';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

const PORT = process.env.BACKEND_PORT || 3001;

// Bộ nhớ tạm để lưu thông tin vận chuyển "Ship-Love"
let currentShipment = {
  active: false,
  lat: 0,
  lng: 0,
  drink: '',
  message: '',
  startTime: null,
  lastUpdate: null,
  path: []
};

// --- WebSocket Logic ---
io.on('connection', (socket) => {
  console.log('User connected to Ship-Love:', socket.id);

  // Gửi trạng thái hiện tại ngay khi Tracker kết nối
  socket.emit('shipmentStatus', currentShipment);

  // Lắng nghe cập nhật vị trí từ Shipper
  socket.on('updateLocation', (data) => {
    if (currentShipment.active) {
      currentShipment.lat = data.lat;
      currentShipment.lng = data.lng;
      currentShipment.lastUpdate = new Date();
      currentShipment.path.push([data.lat, data.lng]);
      
      // Broadcast vị trí mới tới tất cả các Tracker
      io.emit('locationUpdated', {
        lat: data.lat,
        lng: data.lng,
        path: currentShipment.path
      });
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected from Ship-Love');
  });
});

app.get('/', (req, res) => {
  res.send('Mood Weather Station Backend is running with WebSockets! 🚀');
});

// API Vận chuyển: Bắt đầu hành trình
app.post('/api/ship/start', (req, res) => {
  const { lat, lng, drink, message } = req.body;
  currentShipment = {
    active: true,
    lat: lat || 0,
    lng: lng || 0,
    drink: drink || 'Trà sữa',
    message: message || 'Đang đến đây!',
    startTime: new Date(),
    lastUpdate: new Date(),
    path: lat && lng ? [[lat, lng]] : []
  };
  
  // Phát tán sự kiện bắt đầu tới tất cả Tracker
  io.emit('shipmentStarted', currentShipment);
  
  console.log(`[Ship-Love] Started Real-time: ${drink}`);
  res.status(200).json({ success: true, shipment: currentShipment });
});

// API Vận chuyển: Lấy trạng thái (Fallback cho Polling)
app.get('/api/ship/status', (req, res) => {
  res.status(200).json(currentShipment);
});

// Hàm tính khoảng cách giữa 2 điểm GPS (Haversine Formula) - Trả về km
const calculateDistance = (path) => {
  if (!path || path.length < 2) return 0;
  let total = 0;
  const R = 6371; // Bán kính Trái đất

  for (let i = 0; i < path.length - 1; i++) {
    const [lat1, lon1] = path[i];
    const [lat2, lon2] = path[i+1];
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    total += R * c;
  }
  return total.toFixed(2);
};

// API Vận chuyển: Đã tới nơi (Gửi thông báo chúc mừng & Telegram Report)
app.post('/api/ship/arrive', async (req, res) => {
  if (currentShipment.active) {
    const endTime = new Date();
    const duration = Math.round((endTime - new Date(currentShipment.startTime)) / 60000); // phút
    const distance = calculateDistance(currentShipment.path);
    const startLoc = currentShipment.path[0];
    const endLoc = currentShipment.path[currentShipment.path.length - 1];

    // Phát sự kiện Socket cho Tracker
    io.emit('shipmentArrived', {
      drink: currentShipment.drink,
      message: currentShipment.message
    });

    // Gửi báo cáo Telegram
    const token = process.env.VITE_TELEGRAM_BOT_TOKEN;
    const chatId = process.env.VITE_TELEGRAM_CHAT_ID;

    if (token && chatId) {
      const routeLink = `https://www.google.com/maps/dir/${startLoc[0]},${startLoc[1]}/${endLoc[0]},${endLoc[1]}`;
      const report = `
🏁 *HÀNH TRÌNH SHIP-LOVE HOÀN THÀNH!*
--------------------------
🥤 *Món quà:* ${currentShipment.drink}
💬 *Lời nhắn:* ${currentShipment.message}
⏱ *Thời gian di chuyển:* ${duration} phút
📏 *Quãng đường:* ${distance} km

🗺️ *Lộ trình chi tiết:*
[Xem toàn bộ hành trình trên Google Maps](${routeLink})

📍 *Điểm xuất phát:* 
[Xem trên Google Maps](https://www.google.com/maps?q=${startLoc[0]},${startLoc[1]})

📍 *Điểm kết thúc:* 
[Xem trên Google Maps](https://www.google.com/maps?q=${endLoc[0]},${endLoc[1]})

📅 *Hoàn thành lúc:* ${endTime.toLocaleString('vi-VN')}
--------------------------
_Mèo máy đã hoàn thành nhiệm vụ!_ 🐾✨
      `.trim();

      try {
        await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: report,
            parse_mode: 'Markdown',
          }),
        });
      } catch (err) {
        console.error("Failed to send Arrival Telegram message:", err);
      }
    }
    console.log(`[Ship-Love] Arrived & Reported: ${currentShipment.drink}`);
  }
  res.status(200).json({ success: true });
});

// API Vận chuyển: Kết thúc (Xóa trạng thái)
app.post('/api/ship/stop', (req, res) => {
  currentShipment.active = false;
  io.emit('shipmentStopped');
  res.status(200).json({ success: true });
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

httpServer.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
