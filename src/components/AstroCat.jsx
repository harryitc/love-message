import React from 'react';
import { motion } from 'framer-motion';

const AstroCat = ({ state = 'idle', className = "", mousePos = { x: 0.5, y: 0.5 } }) => {
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
    <div className={`relative ${className}`}>
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
          animate={{ rotate: state === 'shook' ? [0, 10, -10, 0] : 0 }}
          transition={{ repeat: state === 'shook' ? Infinity : 0, duration: 0.2 }}
        />
        <motion.path
          d="M140 60 L160 20 L120 40 Z"
          fill="#FFD1DC"
          stroke="#FF99AA"
          strokeWidth="4"
          animate={{ rotate: state === 'shook' ? [0, -10, 10, 0] : 0 }}
          transition={{ repeat: state === 'shook' ? Infinity : 0, duration: 0.2 }}
        />

        {/* Thân/Đầu mèo */}
        <motion.circle
          cx="100"
          cy="100"
          r="60"
          fill="white"
          stroke="#F0F0F0"
          strokeWidth="4"
          animate={{ y: [0, -5, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
        />

        {/* Mắt trái */}
        <g transform="translate(75, 90)">
          <ellipse cx="0" cy="0" rx="10" ry="12" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1" />
          <motion.ellipse
            animate={{ x: lookX, y: lookY }}
            cx="0" cy="0" rx="5" ry="6" fill="#333"
            variants={eyeVariants}
          />
        </g>

        {/* Mắt phải */}
        <g transform="translate(125, 90)">
          <ellipse cx="0" cy="0" rx="10" ry="12" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1" />
          <motion.ellipse
            animate={{ x: lookX, y: lookY }}
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
