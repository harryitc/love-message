import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const RUSSIAN_QUOTES = [
  "Привет! (Chào em!)",
  "Мяу! (Meow!)",
  "Удачи! (Cố lên nha!)",
  "Круто! (Tuyệt quá!)",
  "Чудо! (Kỳ diệu!)",
  "Мило 🌸 (Dễ thương!)",
  "Звезда (Ngôi sao)",
  "Улыбка (Nụ cười)",
  "Котик (Mèo nhỏ)"
];

const AstroCat = ({ state = 'idle', className = "", mousePos = { x: 0.5, y: 0.5 }, onClick }) => {
  const [clicks, setClicks] = useState([]);

  const handleCatClick = (e) => {
    // Gọi hàm onClick từ props (phát âm thanh)
    if (onClick) onClick();

    // Lấy tọa độ click tương đối so với element
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Tạo nội dung ngẫu nhiên
    const randomQuote = RUSSIAN_QUOTES[Math.floor(Math.random() * RUSSIAN_QUOTES.length)];
    const newClick = {
      id: Date.now(),
      text: randomQuote,
      x: clickX,
      y: clickY,
      rotate: (Math.random() - 0.5) * 30 // Xoay nhẹ ngẫu nhiên
    };

    setClicks(prev => [...prev, newClick]);

    // Tự động xóa sau 2 giây
    setTimeout(() => {
      setClicks(prev => prev.filter(c => c.id !== newClick.id));
    }, 2000);
  };

  // Tính toán độ lệch của con ngươi (pupil) - giới hạn trong khoảng nhỏ
  const lookX = (mousePos.x - 0.5) * 12; 
  const lookY = (mousePos.y - 0.5) * 12;

  const eyeVariants = {
    idle: { scaleY: 1 },
    thinking: { x: [0, 2, -2, 0], transition: { repeat: Infinity, duration: 2 } },
    happy: { scaleY: 0.1, transition: { duration: 0.1 } },
    shook: { scale: 1.4 },
  };

  return (
    <div 
      className={`relative cursor-pointer active:scale-95 transition-transform ${className}`}
      onClick={handleCatClick}
    >
      {/* Floating Russian Texts */}
      <AnimatePresence>
        {clicks.map(click => (
          <motion.div
            key={click.id}
            initial={{ opacity: 0, y: 0, scale: 0.5, rotate: click.rotate }}
            animate={{ opacity: 1, y: -80, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute whitespace-nowrap pointer-events-none z-50 text-pink-500 font-bold text-xs sm:text-sm drop-shadow-sm bg-white/90 px-3 py-1 rounded-full border border-pink-100 shadow-sm will-change-transform"
            style={{ 
              left: click.x,
              top: click.y,
              transform: 'translateX(-50%)'
            }}
          >
            {click.text}
          </motion.div>
        ))}
      </AnimatePresence>

      <motion.svg
        viewBox="0 -50 200 250"
        initial="idle"
        animate={state}
        className="w-full h-full"
      >
        {/* Tai mèo */}
        <motion.path
          d="M60 60 L40 20 L80 40 Z"
          fill="#FFD1DC"
          stroke="#FF99AA"
          strokeWidth="4"
          animate={{ 
            rotate: state === 'shook' ? [0, 15, -15, 0] : [0, 5, -5, 0],
            scale: state === 'happy' ? [1, 1.1, 1] : 1
          }}
          transition={{ repeat: Infinity, duration: state === 'shook' ? 0.2 : 2 }}
        />
        <motion.path
          d="M140 60 L160 20 L120 40 Z"
          fill="#FFD1DC"
          stroke="#FF99AA"
          strokeWidth="4"
          animate={{ 
            rotate: state === 'shook' ? [0, -15, 15, 0] : [0, -5, 5, 0],
            scale: state === 'happy' ? [1, 1.1, 1] : 1
          }}
          transition={{ repeat: Infinity, duration: state === 'shook' ? 0.2 : 2 }}
        />

        {/* Thân/Đầu mèo */}
        <motion.circle
          cx="100"
          cy="100"
          r="60"
          fill="white"
          stroke="#F0F0F0"
          strokeWidth="4"
          animate={{ 
            y: state === 'happy' ? [0, -10, 0] : [0, -5, 0],
            scale: state === 'happy' ? [1, 1.05, 1] : 1
          }}
          transition={{ repeat: Infinity, duration: state === 'happy' ? 0.5 : 3 }}
        />

        {/* Má hồng (Blush) - Chỉ hiện khi happy hoặc thinking */}
        <AnimatePresence>
          {(state === 'happy' || state === 'thinking') && (
            <motion.g
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.6, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
            >
              <circle cx="65" cy="115" r="8" fill="#FFB6C1" />
              <circle cx="135" cy="115" r="8" fill="#FFB6C1" />
            </motion.g>
          )}
        </AnimatePresence>

        {/* Mắt trái */}
        <g transform="translate(75, 90)">
          <ellipse cx="0" cy="0" rx="10" ry="12" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1" />
          <motion.ellipse
            animate={state === 'shook' ? { rotate: 360 } : { x: lookX, y: lookY }}
            transition={state === 'shook' ? { repeat: Infinity, duration: 1, ease: "linear" } : { type: 'spring', damping: 15 }}
            cx="0" cy="0" rx="5" ry="6" fill="#333"
            variants={eyeVariants}
          />
        </g>

        {/* Mắt phải */}
        <g transform="translate(125, 90)">
          <ellipse cx="0" cy="0" rx="10" ry="12" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1" />
          <motion.ellipse
            animate={state === 'shook' ? { rotate: 360 } : { x: lookX, y: lookY }}
            transition={state === 'shook' ? { repeat: Infinity, duration: 1, ease: "linear" } : { type: 'spring', damping: 15 }}
            cx="0" cy="0" rx="5" ry="6" fill="#333"
            variants={eyeVariants}
          />
        </g>

        {/* Mũi hồng nhỏ */}
        <circle cx="100" cy="105" r="4" fill="#FF99AA" />

        {/* Miệng */}
        <motion.path
          d={state === 'happy' ? "M85 115 Q100 135 115 115" : "M90 115 Q100 120 110 115"}
          fill="none"
          stroke="#FF99AA"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Hiệu ứng Heart khi Happy - Cập nhật path mới chuẩn hơn */}
        {state === 'happy' && (
          <motion.path
            initial={{ scale: 0, opacity: 0, y: 0 }}
            animate={{ scale: 0.6, opacity: 1, y: -50 }}
            d="M50 85 C20 65 5 45 5 25 A 22 22 0 0 1 49 25 A 22 22 0 0 1 95 25 C 95 45 80 65 50 85 Z"
            fill="#FF4466"
            style={{ x: 50, y: -20, originX: "50px", originY: "85px" }}
          />
        )}
      </motion.svg>
    </div>
  );
};

export default AstroCat;
