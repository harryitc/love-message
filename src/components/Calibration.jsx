import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Zap, Search, Heart } from 'lucide-react';

const Calibration = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const messages = [
    { text: "Đang giải mã nồng độ đáng yêu...", icon: <Search className="w-5 h-5 text-blue-400" /> },
    { text: "Đang kết nối với vệ tinh của anh...", icon: <Zap className="w-5 h-5 text-yellow-400" /> },
    { text: "Đang thiết lập hàng rào bảo vệ chống dỗi...", icon: <Loader2 className="w-5 h-5 animate-spin text-purple-400" /> },
    { text: "Phát hiện 9999+ tế bào muốn đi chơi...", icon: <Heart className="w-5 h-5 text-red-400" /> },
    { text: "Xác minh thành công! Đang mở trạm dự báo...", icon: <Zap className="w-5 h-5 text-green-400" /> }
  ];

  useEffect(() => {
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

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
      <div className="relative mb-12">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
          className="w-32 h-32 border-4 border-dashed border-blue-500/30 rounded-full"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
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
          className="h-full bg-blue-600"
        />
      </div>
      <p className="mt-4 text-[10px] text-slate-400 uppercase tracking-widest">System Calibrating...</p>
    </div>
  );
};

export default Calibration;
