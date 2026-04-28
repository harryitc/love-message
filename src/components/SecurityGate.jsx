import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, Sparkles } from 'lucide-react';
import AstroCat from './AstroCat';

// --- CÁC ICON CUTE SVG ---
const CuteHeart = ({ className = "w-8 h-8" }) => (
  <motion.svg viewBox="0 0 100 100" className={className} animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
    <path 
      d="M50 85 C20 65 5 45 5 25 A 22 22 0 0 1 49 25 A 22 22 0 0 1 95 25 C 95 45 80 65 50 85 Z" 
      fill="#FFB6C1" 
      stroke="#FF69B4" 
      strokeWidth="3" 
    />
    <circle cx="35" cy="45" r="3" fill="#333" />
    <circle cx="65" cy="45" r="3" fill="#333" />
    <circle cx="30" cy="52" r="5" fill="#FF99AA" opacity="0.6" />
    <circle cx="70" cy="52" r="5" fill="#FF99AA" opacity="0.6" />
  </motion.svg>
);

const CuteStar = ({ className = "w-8 h-8" }) => (
  <motion.svg viewBox="0 0 100 100" className={className} animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 3 }}>
    <path d="M50 10 L61 40 L95 40 L67 60 L78 90 L50 70 L22 90 L33 60 L5 40 L39 40 Z" fill="#FFEB3B" stroke="#FBC02D" strokeWidth="3" strokeLinejoin="round" />
    <circle cx="40" cy="45" r="2" fill="#333" />
    <circle cx="60" cy="45" r="2" fill="#333" />
  </motion.svg>
);

const CuteCloud = ({ className = "w-8 h-8" }) => (
  <motion.svg viewBox="0 0 100 100" className={className} animate={{ x: [-2, 2, -2] }} transition={{ repeat: Infinity, duration: 4 }}>
    <path d="M25 70 Q10 70 10 55 Q10 40 25 40 Q25 20 45 20 Q65 20 65 40 Q90 40 90 60 Q90 80 65 80 L25 80 Z" fill="#E0F2F1" stroke="#4DB6AC" strokeWidth="3" />
    <circle cx="40" cy="50" r="2" fill="#333" />
    <circle cx="60" cy="50" r="2" fill="#333" />
  </motion.svg>
);

const CuteShield = ({ className = "w-8 h-8" }) => (
  <motion.svg viewBox="0 0 100 100" className={className} animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 2.5 }}>
    <path d="M50 10 L85 25 L85 55 Q85 85 50 95 Q15 85 15 55 L15 25 Z" fill="#E8EAF6" stroke="#5C6BC0" strokeWidth="3" />
    <circle cx="40" cy="45" r="2" fill="#333" />
    <circle cx="60" cy="45" r="2" fill="#333" />
  </motion.svg>
);

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
    className="absolute pointer-events-none opacity-50 text-pink-400"
    style={{ left: x, top: y }}
  >
    {children}
  </motion.div>
);

const HeartBurst = ({ x, y }) => {
  const hearts = Array.from({ length: 12 });
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {hearts.map((_, i) => (
        <motion.div
          key={i}
          initial={{ x, y, opacity: 1, scale: 0 }}
          animate={{ 
            x: x + (Math.random() - 0.5) * 300,
            y: y + (Math.random() - 0.5) * 300 - 100,
            opacity: 0,
            scale: Math.random() * 1.5 + 0.5,
            rotate: Math.random() * 360
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute text-pink-500"
        >
          <svg viewBox="0 0 100 100" width="24" height="24">
            <path d="M50 85 C20 65 5 45 5 25 A 22 22 0 0 1 49 25 A 22 22 0 0 1 95 25 C 95 45 80 65 50 85 Z" fill="currentColor" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
};

const MiniCatSVG = ({ isWalking = true }) => (
  <motion.div
    animate={isWalking ? { y: [0, -2, 0] } : {}}
    transition={{ repeat: Infinity, duration: 0.4 }}
    className="w-12 h-10 relative -mt-9"
  >
    <svg viewBox="0 0 120 100" className="w-full h-full">
      <motion.path d="M30 55 Q15 45 25 35" fill="none" stroke="#FFB6C1" strokeWidth="5" strokeLinecap="round" animate={{ rotate: [0, -25, 0] }} transition={{ repeat: Infinity, duration: 0.6 }} style={{ originX: "30px", originY: "55px" }} />
      <rect x="25" y="40" width="50" height="30" rx="15" fill="#FFB6C1" />
      <circle cx="75" cy="45" r="20" fill="#FFB6C1" />
      <path d="M65 30 L60 10 L75 25 Z" fill="#FFB6C1" />
      <path d="M80 30 L90 10 L85 25 Z" fill="#FFB6C1" />
      <motion.circle animate={{ scaleY: [1, 1, 0.1, 1] }} transition={{ repeat: Infinity, duration: 3, times: [0, 0.9, 0.95, 1] }} cx="85" cy="42" r="3" fill="white" />
      <circle cx="93" cy="48" r="1.5" fill="#FF69B4" />
      <motion.ellipse animate={isWalking ? { x: [-3, 3, -3] } : {}} transition={{ repeat: Infinity, duration: 0.4, ease: "linear" }} cx="35" cy="70" rx="3" ry="5" fill="#FFB6C1" />
      <motion.ellipse animate={isWalking ? { x: [3, -3, 3] } : {}} transition={{ repeat: Infinity, duration: 0.4, ease: "linear", delay: 0.1 }} cx="55" cy="70" rx="3" ry="5" fill="#FFB6C1" />
      <motion.ellipse animate={isWalking ? { x: [-3, 3, -3] } : {}} transition={{ repeat: Infinity, duration: 0.4, ease: "linear", delay: 0.2 }} cx="45" cy="72" rx="3" ry="5" fill="#FFC0CB" />
      <motion.ellipse animate={isWalking ? { x: [3, -3, 3] } : {}} transition={{ repeat: Infinity, duration: 0.4, ease: "linear", delay: 0.3 }} cx="65" cy="72" rx="3" ry="5" fill="#FFC0CB" />
    </svg>
  </motion.div>
);

const SecurityGate = ({ onComplete, playSFX }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({ nickname: '', birthday: '', favoriteFood: '', dislike: '' });
  const [mascotState, setMascotState] = useState('idle');
  const [bubbleText, setBubbleText] = useState("Привет Huyền! Mèo máy đợi em từ nãy đến giờ nè.");
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [bursts, setBursts] = useState([]);

  const progress = ((currentStep + 1) / 4) * 100;

  useEffect(() => {
    const handleMouseMove = (e) => setMousePos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const steps = [
    {
      id: 'nickname',
      question: "Mèo máy nên gọi em là gì để 'phục vụ' tốt nhất nhỉ?",
      label: "Tên gọi thân mật",
      placeholder: "Biệt danh của em...",
      icon: <CuteHeart />,
      mascotTalk: "Красиво! (Đẹp quá!) Cái tên nghe thôi đã thấy cả một bầu trời đáng yêu rồi!"
    },
    {
      id: 'birthday',
      question: "Ngày nào khiến thế giới của em đặc biệt hơn?",
      label: "Ngày sinh nhật của em",
      placeholder: "xx/xx/2007",
      icon: <CuteStar />,
      mascotTalk: "Молодец! (Giỏi lắm!) Mèo máy sẽ lưu lại để cùng em đón những điều tuyệt vời nhé."
    },
    {
      id: 'favoriteFood',
      question: "Nếu có dịp được mời em đi ăn, em sẽ chọn món gì đầu tiên?",
      label: "Món ăn 'chân ái'",
      placeholder: "Trà sữa, kem, hay một món quà bí mật?",
      icon: <CuteCloud />,
      mascotTalk: "Вкусно! (Ngon lắm!) Món này ngon cực kỳ, em đúng là có gu ăn uống đó!"
    },
    {
      id: 'dislike',
      question: "Mèo máy nên tránh điều gì nhất để em luôn thấy thoải mái?",
      label: "Điều khiến em phiền lòng",
      placeholder: "Sự chờ đợi, những điều không rõ ràng...",
      icon: <CuteShield />,
      mascotTalk: "Ghi nhớ kỹ rồi ạ! Mèo máy sẽ bảo vệ em khỏi những điều này."
    }
  ];

  useEffect(() => {
    if (formData[steps[currentStep].id]) {
      setMascotState('happy');
      setBubbleText(steps[currentStep].mascotTalk);
    } else {
      setMascotState('thinking');
      setBubbleText("Mèo máy đang lắng nghe em nè...");
    }
  }, [formData[steps[currentStep].id], currentStep]);

  const handleNext = (e) => {
    if (formData[steps[currentStep].id]) {
      // Phát âm thanh click và heart
      playSFX('click');
      playSFX('heart');

      const rect = e.currentTarget.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      const newBurst = { id: Date.now(), x, y };
      setBursts(prev => [...prev, newBurst]);
      setTimeout(() => setBursts(prev => prev.filter(b => b.id !== newBurst.id)), 1000);
      if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
      else onComplete(formData);
    }
  };

  return (
    <div className="relative min-h-[100dvh] flex flex-col items-center justify-center py-6 px-4 sm:py-10">
      <FloatingIcon x="5%" y="15%" delay={0}><CuteHeart /></FloatingIcon>
      <FloatingIcon x="85%" y="10%" delay={1}><CuteStar /></FloatingIcon>
      <FloatingIcon x="10%" y="85%" delay={2}><CuteCloud /></FloatingIcon>

      {bursts.map(burst => <HeartBurst key={burst.id} x={burst.x} y={burst.y} />)}

      <div className="relative mt-4 text-center flex flex-col items-center">
        <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 4 }} className="flex flex-col items-center">
          <AnimatePresence mode="wait">
            <motion.div key={bubbleText} initial={{ scale: 0, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0, opacity: 0, y: 10 }} className="mb-4 sm:absolute sm:mb-0 sm:-top-4 sm:-right-44 w-full max-w-[200px] sm:w-48 bg-white p-4 rounded-2xl shadow-xl border border-pink-100 text-sm font-medium text-pink-600 italic text-center sm:text-left">
              {bubbleText}
              <div className="hidden sm:block absolute bottom-4 -left-2 w-4 h-4 bg-white border-l border-b border-pink-100 rotate-45" />
              <div className="sm:hidden absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-r border-b border-pink-100 rotate-45" />
            </motion.div>
          </AnimatePresence>
          <AstroCat state={mascotState} mousePos={mousePos} className="w-28 h-28 sm:w-40 sm:h-40" onClick={() => playSFX('meow')} />
        </motion.div>
      </div>

      <motion.div layout className="w-full max-w-md glass-card rounded-[2.5rem] p-6 sm:p-10 relative z-10">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-100/50 rounded-t-[2.5rem]">
          <div className="relative w-full h-full overflow-hidden rounded-t-[2.5rem]">
            <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} className="h-full bg-gradient-to-r from-pink-400 to-purple-500" />
          </div>
          <motion.div initial={{ left: 0 }} animate={{ left: `${progress}%` }} transition={{ type: "spring", stiffness: 100, damping: 20 }} className="absolute top-0" style={{ transform: 'translateX(-100%)' }}><MiniCatSVG /></motion.div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={currentStep} initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-6 sm:space-y-8 flex flex-col items-center">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 leading-tight text-center flex flex-wrap justify-center items-center gap-2">
              {steps[currentStep].question}
              <span className="inline-block transform translate-y-1">
                {steps[currentStep].icon}
              </span>
            </h2>
            <div className="w-full space-y-4">
              <div className="relative">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2 mb-2 block">{steps[currentStep].label}</label>
                <input autoFocus type={steps[currentStep].type} value={formData[steps[currentStep].id]} onChange={(e) => setFormData({ ...formData, [steps[currentStep].id]: e.target.value })} onKeyDown={(e) => e.key === 'Enter' && handleNext(e)} placeholder={steps[currentStep].placeholder} className="w-full px-5 py-4 bg-white/60 border-2 border-slate-100 rounded-2xl focus:border-pink-300 focus:ring-4 focus:ring-pink-100 outline-none transition-all text-base sm:text-lg font-medium text-slate-700" />
              </div>
              <div className="flex gap-3 pt-2">
                {currentStep > 0 && <button onClick={() => setCurrentStep(prev => prev - 1)} className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-100 active:scale-95 transition-all"><ChevronLeft className="w-6 h-6" /></button>}
                <button onClick={handleNext} disabled={!formData[steps[currentStep].id]} className="flex-1 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-2xl shadow-lg shadow-pink-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:shadow-none active:scale-[0.98] transition-all text-sm sm:text-base">
                  {currentStep === steps.length - 1 ? "HOÀN TẤT CHUẨN BỊ" : "TIẾP TỤC"}
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
      <div className="mt-8 flex items-center gap-2 opacity-60 select-none text-slate-500 font-medium">
        <Sparkles size={12} />
        <span className="text-[10px] font-bold tracking-[0.3em] uppercase">Personalized for Huyền</span>
        <Sparkles size={12} />
      </div>
    </div>
  );
};

export default SecurityGate;
