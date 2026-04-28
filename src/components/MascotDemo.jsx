import React, { useState } from 'react';
import { motion } from 'framer-motion';

const AstroCat = ({ state = 'idle' }) => {
  // Các biến thể biểu cảm của mắt
  const eyeVariants = {
    idle: { scaleY: 1 },
    thinking: { x: [0, 5, -5, 0], transition: { repeat: Infinity, duration: 2 } },
    happy: { scaleY: 0.1, transition: { duration: 0.1 } },
    shook: { scale: 1.5 },
  };

  return (
    <div className="relative w-48 h-48 mx-auto">
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

        {/* Thân/Đầu mèo (Hình tròn trắng) */}
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

        {/* Miệng cười/ngoác */}
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
      
      {/* Bóng dưới chân */}
      <motion.div 
        className="w-24 h-4 bg-slate-200/50 rounded-full mx-auto blur-sm"
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ repeat: Infinity, duration: 3 }}
      />
    </div>
  );
};

const MascotDemo = () => {
  const [mood, setMood] = useState('idle');

  return (
    <div className="p-10 text-center space-y-8 bg-white rounded-[3rem] shadow-2xl max-w-lg mx-auto mt-10 border-4 border-pink-50">
      <h2 className="text-2xl font-bold text-pink-500 uppercase tracking-widest">Mascot Preview</h2>
      
      <div className="py-10 bg-gradient-to-b from-pink-50 to-transparent rounded-3xl">
        <AstroCat state={mood} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {['idle', 'thinking', 'happy', 'shook'].map((m) => (
          <button
            key={m}
            onClick={() => setMood(m)}
            className={`px-6 py-3 rounded-2xl font-bold uppercase text-xs tracking-wider transition-all ${
              mood === m 
                ? 'bg-pink-500 text-white shadow-lg scale-105' 
                : 'bg-slate-100 text-slate-500 hover:bg-pink-100'
            }`}
          >
            {m === 'idle' && 'Bình thường'}
            {m === 'thinking' && 'Đang suy nghĩ...'}
            {m === 'happy' && 'Cực phấn khích!'}
            {m === 'shook' && 'Hết hồn!'}
          </button>
        ))}
      </div>

      <p className="text-slate-400 text-sm italic">
        Thử bấm các nút trên để xem chú mèo thay đổi biểu cảm nhé!
      </p>
    </div>
  );
};

export default MascotDemo;
