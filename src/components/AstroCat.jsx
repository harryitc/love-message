import React from 'react';
import { motion } from 'framer-motion';

const AstroCat = ({ state = 'idle', className = "" }) => {
  const eyeVariants = {
    idle: { scaleY: 1 },
    thinking: { x: [0, 5, -5, 0], transition: { repeat: Infinity, duration: 2 } },
    happy: { scaleY: 0.1, transition: { duration: 0.1 } },
    shook: { scale: 1.5 },
  };

  return (
    <div className={`relative ${className}`}>
      <motion.svg
        viewBox="0 0 200 200"
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
        <motion.ellipse
          cx="75"
          cy="90"
          rx="6"
          ry="8"
          fill="#333"
          variants={eyeVariants}
        />
        {/* Mắt phải */}
        <motion.ellipse
          cx="125"
          cy="90"
          rx="6"
          ry="8"
          fill="#333"
          variants={eyeVariants}
        />

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

        {/* Hiệu ứng Heart khi Happy */}
        {state === 'happy' && (
          <motion.path
            initial={{ scale: 0, opacity: 0, y: 0 }}
            animate={{ scale: 1.2, opacity: 1, y: -40 }}
            d="M100 60 Q110 50 120 60 T100 80 T80 60 T100 60"
            fill="#FF4466"
          />
        )}
      </motion.svg>
    </div>
  );
};

export default AstroCat;
