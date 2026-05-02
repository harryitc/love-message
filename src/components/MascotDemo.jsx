import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Sparkles, Loader2, Satellite, AlertCircle, Heart, Navigation } from 'lucide-react';
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

const LocationSimulation = () => {
  const [showSim, setShowSim] = useState(false);
  const [simStep, setSimStep] = useState('idle'); // idle, requesting, denied, success
  const [mascotState, setMascotState] = useState('thinking');
  const [bubbleText, setBubbleText] = useState("Huyền ơi, Mèo máy đang bị lạc giữa các vì sao... ✨");

  const startSim = () => {
    setShowSim(true);
    setSimStep('requesting');
    setMascotState('thinking');
    setBubbleText("Em bật 'tín hiệu' để Mèo máy tìm đường về chỗ em nhé! 🐾");
  };

  const handleRequest = () => {
    setSimStep('processing');
    setBubbleText("Đang bắt sóng tín hiệu... Chờ Mèo máy xíu nha! 📡");
    
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setSimStep('success');
          setMascotState('happy');
          setBubbleText("Hú uuu! Kết nối thành công rồi! Mèo máy đang bay vèo tới chỗ em đây! 🚀💖");
          setTimeout(() => {
            // Trong thực tế sẽ chuyển trang, ở đây chỉ đóng sim sau 3s
            // setShowSim(false);
          }, 3000);
        },
        (error) => {
          setSimStep('denied');
          setMascotState('shook');
          setBubbleText("Huhu, không có tọa độ Mèo máy không biết bay về đâu để gặp em cả... (╯︵╰,)");
        },
        { timeout: 10000 }
      );
    } else {
      setSimStep('denied');
      setMascotState('shook');
      setBubbleText("Thiết bị của em không hỗ trợ 'tín hiệu vũ trụ' rồi, buồn quá đi... 😿");
    }
  };

  return (
    <div className="pt-10 border-t border-slate-100">
      <h2 className="text-xl font-bold text-purple-500 uppercase tracking-widest mb-6">Thử nghiệm: Tín hiệu Vũ trụ</h2>
      <div className="bg-purple-50 p-8 rounded-3xl space-y-4">
        <p className="text-sm text-slate-600 leading-relaxed font-medium">
          Mô phỏng kịch bản lấy GPS bắt buộc với phong cách nũng nịu.
        </p>
        <button 
          onClick={startSim}
          className="px-8 py-3 bg-purple-500 text-white rounded-2xl font-bold shadow-lg shadow-purple-200 hover:bg-purple-600 active:scale-95 transition-all flex items-center gap-2 mx-auto"
        >
          <Satellite size={20} />
          CHẠY THỬ KỊCH BẢN GPS
        </button>
      </div>

      <AnimatePresence>
        {showSim && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-md overflow-y-auto py-10 px-4 sm:px-6"
          >
            <div className="min-h-full flex items-center justify-center">
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 30 }}
                className="bg-white rounded-[3rem] p-8 sm:p-12 max-w-md w-full shadow-2xl relative overflow-hidden text-center"
              >
              {/* Close button for Demo only */}
              <button 
                onClick={() => setShowSim(false)}
                className="absolute top-6 right-6 text-slate-300 hover:text-slate-500 transition-colors"
              >
                Đóng Demo
              </button>

              <div className="space-y-8">
                <div className="relative inline-block">
                  <motion.div
                    animate={{ 
                      y: [0, -10, 0],
                      rotate: mascotState === 'shook' ? [0, 5, -5, 0] : 0
                    }}
                    transition={{ repeat: Infinity, duration: 4 }}
                  >
                    <AstroCat state={mascotState} className="w-32 h-32 mx-auto" />
                  </motion.div>
                  
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={bubbleText}
                      initial={{ scale: 0, opacity: 0, x: 20 }}
                      animate={{ scale: 1, opacity: 1, x: 0 }}
                      exit={{ scale: 0, opacity: 0, x: 20 }}
                      className="absolute -top-4 -right-24 w-40 bg-pink-50 p-3 rounded-2xl border border-pink-100 text-[11px] font-bold text-pink-600 italic shadow-sm"
                    >
                      {bubbleText}
                      <div className="absolute bottom-2 -left-1.5 w-3 h-3 bg-pink-50 border-l border-b border-pink-100 rotate-45" />
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="space-y-4">
                  <h3 className="text-2xl font-black text-slate-800 tracking-tight flex items-center justify-center gap-2">
                    {simStep === 'success' ? <Heart className="text-pink-500 fill-pink-500" /> : <MapPin className="text-purple-500" />}
                    {simStep === 'success' ? "ĐÃ KẾT NỐI!" : "TÍN HIỆU VŨ TRỤ"}
                  </h3>
                  
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    {simStep === 'requesting' && (
                      <p className="text-slate-600 text-sm font-medium">
                        Mèo máy cần biết Huyền đang ở đâu dưới bầu trời này để "hạ cánh" chính xác nhất. Huyền cho phép Mèo máy một xíu nhé? ✨
                      </p>
                    )}
                    {simStep === 'processing' && (
                      <div className="flex flex-col items-center gap-3 py-2">
                        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
                        <p className="text-purple-600 font-bold text-xs animate-pulse uppercase tracking-widest">Đang tìm kiếm tọa độ của em...</p>
                      </div>
                    )}
                    {simStep === 'denied' && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-center gap-2 text-rose-500">
                          <AlertCircle size={18} />
                          <span className="font-bold text-xs uppercase tracking-wider">Lỗi kết nối</span>
                        </div>
                        <p className="text-slate-600 text-sm font-medium">
                          Mèo máy không tìm thấy em rồi... Em kiểm tra lại cài đặt vị trí trên trình duyệt và cho phép Mèo máy nha! 🥺
                        </p>
                      </div>
                    )}
                    {simStep === 'success' && (
                      <div className="space-y-2">
                        <p className="text-green-600 font-bold text-sm">
                          Tọa độ đã được xác minh! 📍
                        </p>
                        <p className="text-slate-600 text-xs font-medium">
                          Hành trình tiếp theo sẽ cực kỳ thú vị đây. Chuẩn bị tinh thần nhé!
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4">
                  {simStep === 'success' ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="bg-green-100 text-green-700 font-black py-4 rounded-2xl flex items-center justify-center gap-2 uppercase tracking-widest"
                    >
                      CHUYỂN HƯỚNG SAU 3 GIÂY...
                    </motion.div>
                  ) : (
                    <motion.button 
                      whileHover={{ scale: 1.02, shadow: "0 10px 25px rgba(168,85,247,0.3)" }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleRequest}
                      disabled={simStep === 'processing'}
                      className={`w-full py-4 rounded-2xl text-white font-black flex items-center justify-center gap-3 transition-all text-sm tracking-widest uppercase shadow-lg ${
                        simStep === 'denied' ? 'bg-rose-500 shadow-rose-100' : 'bg-gradient-to-r from-purple-500 to-pink-500 shadow-purple-100'
                      }`}
                    >
                      {simStep === 'processing' ? (
                        <>
                          <Loader2 className="animate-spin w-5 h-5" />
                          ĐANG BẮT SÓNG...
                        </>
                      ) : simStep === 'denied' ? (
                        <>
                          THỬ KẾT NỐI LẠI 🐾
                        </>
                      ) : (
                        <>
                          GỬI TÍN HIỆU NGAY! 🌸
                        </>
                      )}
                    </motion.button>
                  )}
                  
                  {simStep === 'denied' && (
                    <p className="mt-4 text-[10px] text-slate-400 font-bold uppercase tracking-widest px-4">
                      Mẹo: Nhấn vào icon ổ khóa trên thanh địa chỉ để bật lại quyền vị trí nha!
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
  );
};

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

      <LocationSimulation />

      <div className="pt-10 border-t border-slate-100">
        <h2 className="text-xl font-bold text-indigo-500 uppercase tracking-widest mb-6">Mèo Mini (Chạy Progress)</h2>
        <div className="flex flex-col items-center gap-4 bg-slate-50 p-8 rounded-3xl">
          <MiniCatSVG />
          <p className="text-xs text-slate-400 italic">Phiên bản hồng chạy ngang</p>
        </div>
      </div>
    </div>
  );
};

export default MascotDemo;

