/**
 * Gửi thông tin người dùng về Telegram Bot một cách âm thầm.
 */
export const sendTelegramMessage = async (userData, locationData = null) => {
  const token = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
  const chatId = import.meta.env.VITE_TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn("Telegram configuration missing. Check your .env file.");
    return;
  }

  let text = `
🚀 *THÔNG BÁO MỚI TỪ WEBSITE*
--------------------------
👤 *Biệt danh:* ${userData?.nickname || 'Không có'}
🎂 *Sinh nhật:* ${userData?.birthday || 'Không có'}
🍜 *Món yêu thích:* ${userData?.favoriteFood || 'Không có'}
❌ *Điều không thích:* ${userData?.dislike || 'Không có'}
`.trim();

  if (locationData) {
    const { latitude, longitude } = locationData;
    const mapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
    text += `\n\n📍 *VỊ TRÍ THỰC TẾ (GPS):*\n[Xem trên Google Maps](${mapsLink})\n(Lat: ${latitude}, Lng: ${longitude})`;
  }

  text += `\n--------------------------\n🕒 *Thời gian:* ${new Date().toLocaleString('vi-VN')}`;

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'Markdown',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Telegram API error:", errorData);
    }
  } catch (error) {
    console.error("Failed to send Telegram message:", error);
  }
};

/**
 * Gửi báo cáo lỗi kỹ thuật về Telegram Bot.
 */
export const sendErrorReport = async (error, context = "") => {
  const token = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
  const chatId = import.meta.env.VITE_TELEGRAM_CHAT_ID;

  if (!token || !chatId) return;

  const errorMessage = error?.message || String(error);
  // Lấy 500 ký tự đầu của stack trace để tránh tin nhắn quá dài
  const stackTrace = error?.stack ? `\n\n*Stack Trace:*\n\`\`\`\n${error.stack.substring(0, 500)}...\n\`\`\`` : "";

  const text = `
⚠️ *CẢNH BÁO LỖI HỆ THỐNG*
--------------------------
🔴 *Lỗi:* ${errorMessage}
📂 *Bối cảnh:* ${context || 'Global Error'}
🌐 *URL:* ${window.location.href}
${stackTrace}
--------------------------
🕒 *Thời gian:* ${new Date().toLocaleString('vi-VN')}
`.trim();

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
    console.error("Failed to send error report to Telegram:", err);
  }
};

/**
 * Gửi yêu cầu Order từ Huyền về cho Cường.
 */
export const sendOrderRequest = async (orderContent, nickname = "Huyền") => {
  const token = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
  const chatId = import.meta.env.VITE_TELEGRAM_CHAT_ID;

  if (!token || !chatId) return false;

  const text = `
🎁 *YÊU CẦU ORDER MỚI TỪ ${nickname.toUpperCase()}!*
--------------------------
✨ *Nội dung:* "${orderContent}"
🐾 *Ghi chú:* "Mèo máy đang chờ lệnh để đi ship ngay đây!"

👉 [Mở bản đồ điều phối ngay](https://ahihi-weather.vercel.app/ship-love?mode=ship)
--------------------------
🕒 *Thời gian:* ${new Date().toLocaleString('vi-VN')}
`.trim();

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'Markdown',
      }),
    });
    return response.ok;
  } catch (err) {
    console.error("Failed to send order request to Telegram:", err);
    return false;
  }
};
