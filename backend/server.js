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
  path: [] // Cấu trúc: { lat, lng, t }
};

// --- WebSocket Logic ---
io.on('connection', (socket) => {
  console.log('User connected to Ship-Love:', socket.id);
  socket.emit('shipmentStatus', currentShipment);

  socket.on('updateLocation', (data) => {
    if (currentShipment.active) {
      const now = data.t ? new Date(data.t) : new Date();
      currentShipment.lat = data.lat;
      currentShipment.lng = data.lng;
      currentShipment.lastUpdate = now;
      currentShipment.path.push({ lat: data.lat, lng: data.lng, t: now.getTime() });
      
      io.emit('locationUpdated', {
        lat: data.lat,
        lng: data.lng,
        path: currentShipment.path
      });
    }
  });

  socket.on('syncBatch', (data) => {
    if (currentShipment.active && data.points && data.points.length > 0) {
      console.log(`Syncing batch of ${data.points.length} points for ${socket.id}`);
      
      data.points.forEach(point => {
        const t = point.t || Date.now();
        currentShipment.path.push({ lat: point.lat, lng: point.lng, t });
      });

      // Sắp xếp lại path theo thời gian để đảm bảo thứ tự
      currentShipment.path.sort((a, b) => a.t - b.t);

      const lastPoint = data.points[data.points.length - 1];
      currentShipment.lat = lastPoint.lat;
      currentShipment.lng = lastPoint.lng;
      currentShipment.lastUpdate = new Date(lastPoint.t || Date.now());

      // Phát sóng batch cho các client khác (người nhận) để vẽ cinematic replay
      socket.broadcast.emit('batchLocationUpdated', {
        batch: data.points,
        fullPath: currentShipment.path
      });
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Hàm tính khoảng cách giữa 2 điểm GPS (Haversine Formula) - Trả về km
const calculateDistance = (path) => {
  if (!path || path.length < 2) return 0;
  let total = 0;
  const R = 6371;

  for (let i = 0; i < path.length - 1; i++) {
    const p1 = path[i];
    const p2 = path[i+1];
    const lat1 = p1.lat;
    const lon1 = p1.lng;
    const lat2 = p2.lat;
    const lon2 = p2.lng;
    
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

app.get('/', (req, res) => {
  res.send('Mood Weather Station Backend V3.1 is running! 🚀');
});

app.post('/api/ship/start', (req, res) => {
  const { lat, lng, drink, message } = req.body;
  const now = new Date();
  currentShipment = {
    active: true,
    lat: lat || 0,
    lng: lng || 0,
    drink: drink || 'Trà sữa',
    message: message || 'Đang đến đây!',
    startTime: now,
    lastUpdate: now,
    path: lat && lng ? [{ lat, lng, t: now.getTime() }] : []
  };
  io.emit('shipmentStarted', currentShipment);
  res.status(200).json({ success: true, shipment: currentShipment });
});

app.get('/api/ship/status', (req, res) => {
  res.status(200).json(currentShipment);
});

app.post('/api/ship/arrive', async (req, res) => {
  if (currentShipment.active) {
    const endTime = new Date();
    const duration = Math.round((endTime - new Date(currentShipment.startTime)) / 60000);
    const distance = calculateDistance(currentShipment.path);
    const startLoc = currentShipment.path[0];
    const endLoc = currentShipment.path[currentShipment.path.length - 1];

    io.emit('shipmentArrived', {
      drink: currentShipment.drink,
      message: currentShipment.message,
      path: currentShipment.path
    });

    const token = process.env.VITE_TELEGRAM_BOT_TOKEN;
    const chatId = process.env.VITE_TELEGRAM_CHAT_ID;

    if (token && chatId) {
      const routeLink = `https://www.google.com/maps/dir/${startLoc.lat},${startLoc.lng}/${endLoc.lat},${endLoc.lng}`;
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
[Xem trên Google Maps](https://www.google.com/maps?q=${startLoc.lat},${startLoc.lng})

📍 *Điểm kết thúc:* 
[Xem trên Google Maps](https://www.google.com/maps?q=${endLoc.lat},${endLoc.lng})

📅 *Hoàn thành lúc:* ${endTime.toLocaleString('vi-VN')}
--------------------------
_Mèo máy đã hoàn thành nhiệm vụ!_ 🐾✨
      `.trim();

      try {
        await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: chatId, text: report, parse_mode: 'Markdown' }),
        });
      } catch (err) { console.error(err); }
    }
  }
  res.status(200).json({ success: true });
});

app.post('/api/ship/stop', (req, res) => {
  currentShipment.active = false;
  io.emit('shipmentStopped');
  res.status(200).json({ success: true });
});

app.post('/api/track-ip', async (req, res) => {
  const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;
  const { nickname, action } = req.body;
  const actionText = action === 'welcome' ? '🚀 BẮT ĐẦU HÀNH TRÌNH' : '💌 MỞ THƯ TÂM SỰ';
  
  let geoInfo = "";
  let mapsLink = "";

  try {
    if (ip !== '::1' && ip !== '127.0.0.1' && !ip.includes('192.168.')) {
      const geoRes = await fetch(`https://ipapi.co/${ip}/json/`);
      const geoData = await geoRes.json();
      if (!geoData.error) {
        const { city, region, country_name, latitude, longitude, org } = geoData;
        geoInfo = `📍 *Vị trí ước tính:* ${city}, ${region}, ${country_name}\n🏢 *Nhà mạng:* ${org}`;
        mapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
      }
    } else { geoInfo = `📍 *Vị trí:* Localhost`; }
  } catch (err) { console.error(err); }

  const token = process.env.VITE_TELEGRAM_BOT_TOKEN;
  const chatId = process.env.VITE_TELEGRAM_CHAT_ID;

  if (token && chatId) {
    let text = `✨ *THÔNG BÁO: ${actionText}*\n--------------------------\n👤 *Đối tượng:* ${nickname || 'Người dùng mới'}\n🌐 *IP:* \`${ip}\`\n${geoInfo}`.trim();
    if (mapsLink) text += `\n🔗 [Xem trên Google Maps](${mapsLink})`;
    text += `\n🕒 *Thời gian:* ${new Date().toLocaleString('vi-VN')}`;

    try {
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: text, parse_mode: 'Markdown' }),
      });
    } catch (err) { console.error(err); }
  }
  res.status(200).json({ success: true });
});

httpServer.listen(PORT, () => {
  console.log(`🚀 Server V3.1 is running on http://localhost:${PORT}`);
});
