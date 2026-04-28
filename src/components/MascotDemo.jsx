import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AstroCat from './AstroCat';

const MiniCatSVG = ({ isWalking = true }) => (
  <motion.div
    animate={isWalking ? { 
      y: [0, -2, 0],
    } : {}}
    transition={{ repeat: Infinity, duration: 0.4 }}
    className="w-16 h-12 relative"
  >
    <svg viewBox="0 0 120 100" className="w-full h-full">
      {/* Đuôi - Gắn vào phía sau thân (bên trái) */}
      <motion.path
        d="M30 55 Q15 45 25 35"
        fill="none"
        stroke="#FFB6C1"
        strokeWidth="5"
        strokeLinecap="round"
        animate={{ rotate: [0, -25, 0] }}
        transition={{ repeat: Infinity, duration: 0.6 }}
        style={{ originX: "30px", originY: "55px" }}
      />
      
      {/* Thân dài nằm ngang */}
      <rect x="25" y="40" width="50" height="30" rx="15" fill="#FFB6C1" />
      
      {/* Đầu mập mạp ở bên phải */}
      <circle cx="75" cy="45" r="20" fill="#FFB6C1" />
      
      {/* Tai (nhìn từ bên cạnh) */}
      <path d="M65 30 L60 10 L75 25 Z" fill="#FFB6C1" />
      <path d="M80 30 L90 10 L85 25 Z" fill="#FFB6C1" />
      
      {/* Mắt nhìn về bên phải */}
      <motion.circle 
        animate={{ scaleY: [1, 1, 0.1, 1] }}
        transition={{ repeat: Infinity, duration: 3, times: [0, 0.9, 0.95, 1] }}
        cx="85" cy="42" r="3" fill="white" 
      />
      
      {/* Mũi ở phía trước (phải) */}
      <circle cx="93" cy="48" r="1.5" fill="#FF69B4" />
      
      {/* Chân chạy luân phiên */}
      <motion.ellipse 
        animate={isWalking ? { x: [-3, 3, -3], y: [0, -2, 0] } : {}}
        transition={{ repeat: Infinity, duration: 0.4, ease: "linear" }}
        cx="35" cy="70" rx="3" ry="5" fill="#FFB6C1" 
      />
      <motion.ellipse 
        animate={isWalking ? { x: [3, -3, 3], y: [0, -2, 0] } : {}}
        transition={{ repeat: Infinity, duration: 0.4, ease: "linear", delay: 0.1 }}
        cx="55" cy="70" rx="3" ry="5" fill="#FFB6C1" 
      />
      <motion.ellipse 
        animate={isWalking ? { x: [-3, 3, -3], y: [0, -2, 0] } : {}}
        transition={{ repeat: Infinity, duration: 0.4, ease: "linear", delay: 0.2 }}
        cx="45" cy="72" rx="3" ry="5" fill="#FFC0CB" 
      />
      <motion.ellipse 
        animate={isWalking ? { x: [3, -3, 3], y: [0, -2, 0] } : {}}
        transition={{ repeat: Infinity, duration: 0.4, ease: "linear", delay: 0.3 }}
        cx="65" cy="72" rx="3" ry="5" fill="#FFC0CB" 
      />
    </svg>
  </motion.div>
);

const MascotDemo = () => {
  const [mood, setMood] = useState('idle');

  return (
    <div className="p-10 text-center space-y-12 bg-white rounded-[3rem] shadow-2xl max-w-lg mx-auto mt-10 border-4 border-pink-50">
      <div>
        <h2 className="text-xl font-bold text-pink-500 uppercase tracking-widest mb-6">Mascot Lớn (Astro Cat)</h2>
        <div className="py-10 bg-gradient-to-b from-pink-50 to-transparent rounded-3xl">
          <AstroCat state={mood} />
        </div>
      </div>

      <div className="pt-10 border-t border-slate-100">
        <h2 className="text-xl font-bold text-indigo-500 uppercase tracking-widest mb-6">Mèo Mini (Chạy Progress)</h2>
        <div className="flex flex-col items-center gap-4 bg-slate-50 p-8 rounded-3xl">
          <MiniCatSVG />
          <p className="text-xs text-slate-400 italic">Phiên bản hồng chạy ngang</p>
        </div>
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
    </div>
  );
};

export default MascotDemo;
