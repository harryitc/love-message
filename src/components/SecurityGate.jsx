import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Fingerprint, Sparkles, Heart, Star, Cloud, ArrowRight, ChevronLeft } from 'lucide-react';

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

  const steps = [
    {
      id: 'nickname',
      question: "Hệ thống nên gọi em là gì nhỉ? ✨",
      label: "Mật danh đáng yêu",
      placeholder: "Nhập biệt danh của em...",
      icon: <Heart className="w-10 h-10 text-pink-500" />,
      type: "text"
    },
    {
      id: 'birthday',
      question: "Tọa độ thời gian em xuất hiện là khi nào? 🎂",
      label: "Ngày sinh nhật",
      placeholder: "",
      icon: <Star className="w-10 h-10 text-yellow-500" />,
      type: "date"
    },
    {
      id: 'favoriteFood',
      question: "Món gì có thể khiến em 'tan chảy' ngay lập tức? 🍦",
      label: "Nguồn nhiên liệu ưa thích",
      placeholder: "Trà sữa, kem, hay là... anh?",
      icon: <Cloud className="w-10 h-10 text-blue-400" />,
      type: "text"
    },
    {
      id: 'dislike',
      question: "Điều gì khiến 'thời tiết' của em xấu đi? ⛈️",
      label: "Tác nhân gây biến đổi khí hậu",
      placeholder: "Nhắn tin chậm, bị bỏ rơi...",
      icon: <ShieldCheck className="w-10 h-10 text-indigo-500" />,
      type: "text"
    }
  ];

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
    <div className="relative min-h-[500px] flex items-center justify-center py-10">
      {/* Floating Elements Around */}
      <FloatingIcon x="10%" y="20%" delay={0}><Heart fill="currentColor" /></FloatingIcon>
      <FloatingIcon x="85%" y="15%" delay={1}><Star fill="currentColor" /></FloatingIcon>
      <FloatingIcon x="15%" y="70%" delay={2}><Cloud fill="currentColor" /></FloatingIcon>
      <FloatingIcon x="80%" y="80%" delay={0.5}><Sparkles fill="currentColor" /></FloatingIcon>
      <FloatingIcon x="50%" y="5%" delay={1.5}><Heart fill="currentColor" className="w-4 h-4" /></FloatingIcon>

      <motion.div 
        layout
        className="w-full max-w-md glass-card rounded-[2.5rem] p-8 relative z-10 overflow-hidden"
      >
        {/* Progress Bar */}
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
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            <div className="flex flex-col items-center text-center gap-4">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="p-5 bg-white rounded-3xl shadow-sm border border-pink-50"
              >
                {steps[currentStep].icon}
              </motion.div>
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
                  className="w-full px-6 py-4 bg-white/50 border-2 border-slate-100 rounded-2xl focus:border-pink-300 focus:ring-4 focus:ring-pink-100 outline-none transition-all text-lg font-medium text-slate-700"
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
                  {currentStep === steps.length - 1 ? (
                    <>
                      <Fingerprint className="w-5 h-5" />
                      XÁC MINH NGAY
                    </>
                  ) : (
                    <>
                      TIẾP TỤC
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400 uppercase tracking-[0.2em]">
          <span>Step {currentStep + 1} of {steps.length}</span>
          <span>Security Level: High</span>
        </div>
      </motion.div>
    </div>
  );
};

export default SecurityGate;
