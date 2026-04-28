import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Fingerprint, Sparkles, Heart, Star, Cloud, ArrowRight, ChevronLeft } from 'lucide-react';
import AstroCat from './AstroCat';

const FloatingIcon = ({ children, delay = 0, x = 0, y = 0 }) => (
  <motion.div
    initial={{ y: 0 }}
    animate={{ 
      y: [0, -20, 0],
      rotate: [0, 10, -10, 0],
      scale: [1, 1.1, 1]
    }}
    transition={{ 
      duration: 3 + Math.random() * 2, 
      repeat: Infinity, 
      delay 
    }}
    className="absolute pointer-events-none opacity-40 text-pink-400"
    style={{ left: x, top: y }}
  >
    {children}
  </motion.div>
);

const SecurityGate = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    nickname: '',
    birthday: '',
    favoriteFood: '',
    dislike: ''
  });
  const [mascotState, setMascotState] = useState('idle');
  const [bubbleText, setBubbleText] = useState("Chào em! Anh đợi hơi lâu rồi đấy.");

  const steps = [
    {
      id: 'nickname',
      question: "Hệ thống nên gọi em là gì nhỉ? ✨",
      label: "Mật danh đáng yêu",
      placeholder: "Nhập biệt danh của em...",
      icon: <Heart className="w-10 h-10 text-pink-500" />,
      type: "text",
      mascotTalk: "Tên xinh thế này chắc chắn chủ nhân cũng xinh lắm!"
    },
    {
      id: 'birthday',
      question: "Tọa độ thời gian em xuất hiện là khi nào? 🎂",
      label: "Ngày sinh nhật",
      placeholder: "",
      icon: <Star className="w-10 h-10 text-yellow-500" />,
      type: "date",
      mascotTalk: "Ngày này chắc chắn là ngày đẹp nhất năm rồi."
    },
    {
      id: 'favoriteFood',
      question: "Món gì có thể khiến em 'tan chảy' ngay lập tức? 🍦",
      label: "Nguồn nhiên liệu ưa thích",
      placeholder: "Trà sữa, kem, hay là... anh?",
      icon: <Cloud className="w-10 h-10 text-blue-400" />,
      type: "text",
      mascotTalk: "Món này ngon cực! Ghi vào sổ tay để sau này anh mua cho."
    },
    {
      id: 'dislike',
      question: "Điều gì khiến 'thời tiết' của em xấu đi? ⛈️",
      label: "Tác nhân gây biến đổi khí hậu",
      placeholder: "Nhắn tin chậm, bị bỏ rơi...",
      icon: <ShieldCheck className="w-10 h-10 text-indigo-500" />,
      type: "text",
      mascotTalk: "Ối sợ thế! Anh hứa sẽ không bao giờ làm thế với em đâu."
    }
  ];

  useEffect(() => {
    if (formData[steps[currentStep].id]) {
      setMascotState('happy');
      setBubbleText(steps[currentStep].mascotTalk);
    } else {
      setMascotState('thinking');
      setBubbleText("Đang đợi em nhập nè...");
    }
  }, [formData[steps[currentStep].id], currentStep]);

  const handleNext = () => {
    if (formData[steps[currentStep].id]) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        onComplete(formData);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="relative min-h-[600px] flex flex-col items-center justify-center py-10 px-4">
      {/* Floating Elements */}
      <FloatingIcon x="5%" y="15%" delay={0}><Heart fill="currentColor" /></FloatingIcon>
      <FloatingIcon x="90%" y="10%" delay={1}><Star fill="currentColor" /></FloatingIcon>
      <FloatingIcon x="10%" y="80%" delay={2}><Cloud fill="currentColor" /></FloatingIcon>
      <FloatingIcon x="85%" y="75%" delay={0.5}><Sparkles fill="currentColor" /></FloatingIcon>

      {/* Mascot Section */}
      <div className="relative mb-6">
        <motion.div 
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 4 }}
          className="relative"
        >
          <AstroCat state={mascotState} className="w-32 h-32" />
          
          {/* Speech Bubble */}
          <motion.div
            key={bubbleText}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute -top-12 -right-32 w-48 bg-white p-3 rounded-2xl rounded-bl-none shadow-lg border border-pink-100 text-xs font-medium text-pink-600 italic leading-relaxed"
          >
            {bubbleText}
            <div className="absolute -bottom-2 left-0 w-4 h-4 bg-white border-l border-b border-pink-100 rotate-45" />
          </motion.div>
        </motion.div>
      </div>

      <motion.div 
        layout
        className="w-full max-w-md glass-card rounded-[2.5rem] p-8 relative z-10 overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-100/50">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            className="h-full bg-gradient-to-r from-pink-400 to-purple-500"
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            className="space-y-8"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold text-slate-800 leading-tight">
                {steps[currentStep].question}
              </h2>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-2 mb-2 block">
                  {steps[currentStep].label}
                </label>
                <input
                  autoFocus
                  type={steps[currentStep].type}
                  value={formData[steps[currentStep].id]}
                  onChange={(e) => setFormData({ ...formData, [steps[currentStep].id]: e.target.value })}
                  onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                  placeholder={steps[currentStep].placeholder}
                  className="w-full px-6 py-4 bg-white/50 border-2 border-slate-100 rounded-2xl focus:border-pink-300 focus:ring-4 focus:ring-pink-100 outline-none transition-all text-lg font-medium text-slate-700 placeholder:text-slate-300"
                />
              </div>

              <div className="flex gap-3 pt-4">
                {currentStep > 0 && (
                  <button
                    onClick={handleBack}
                    className="p-4 bg-slate-100 text-slate-500 rounded-2xl hover:bg-slate-200 transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                )}
                <button
                  onClick={handleNext}
                  disabled={!formData[steps[currentStep].id]}
                  className="flex-1 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-2xl shadow-lg shadow-pink-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:shadow-none transition-all"
                >
                  {currentStep === steps.length - 1 ? "XÁC MINH NGAY" : "TIẾP TỤC"}
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default SecurityGate;
