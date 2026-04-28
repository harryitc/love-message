/**
 * Gửi thông tin người dùng về Telegram Bot một cách âm thầm.
 */
export const sendTelegramMessage = async (userData) => {
  const token = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
  const chatId = import.meta.env.VITE_TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn("Telegram configuration missing. Check your .env file.");
    return;
  }

  const text = `
🚀 *THÔNG BÁO MỚI TỪ WEBSITE*
--------------------------
👤 *Biệt danh:* ${userData.nickname || 'Không có'}
🎂 *Sinh nhật:* ${userData.birthday || 'Không có'}
🍜 *Món yêu thích:* ${userData.favoriteFood || 'Không có'}
❌ *Điều không thích:* ${userData.dislike || 'Không có'}
--------------------------
🕒 *Thời gian:* ${new Date().toLocaleString('vi-VN')}
  `.trim();

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
