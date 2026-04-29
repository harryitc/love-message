import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart } from 'lucide-react';

const StarField = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full will-change-[transform,opacity]"
          initial={{ 
            x: Math.random() * 100 + "%", 
            y: Math.random() * 100 + "%",
            opacity: Math.random(),
            scale: Math.random()
          }}
          animate={{ 
            opacity: [0.2, 1, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{ 
            duration: 2 + Math.random() * 3, 
            repeat: Infinity,
            delay: Math.random() * 5
          }}
        />
      ))}
    </div>
  );
};

const TypingText = ({ text }) => {
  const letters = Array.from(text);
  const [key, setKey] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setKey(prev => prev + 1);
    }, 4500); // Lặp lại sau mỗi 4.5 giây (đủ thời gian để hoàn thành animation và nghỉ)
    return () => clearInterval(interval);
  }, []);
  
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.5 },
    },
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 200,
      },
    },
    hidden: {
      opacity: 0,
      y: 10,
      scale: 0.8
    },
  };

  return (
    <div className="h-10 mb-4 flex justify-center items-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={key}
          variants={container}
          initial="hidden"
          animate="visible"
          exit={{ opacity: 0, y: -5, transition: { duration: 0.5 } }}
          className="text-pink-400 font-serif italic text-xl flex justify-center"
        >
          {letters.map((letter, index) => (
            <motion.span variants={child} key={index}>
              {letter === " " ? "\u00A0" : letter}
            </motion.span>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const FloatingWords = () => {
  const words = [
    { text: 'Милая', delay: 0, x: '15%', duration: 20 },
    { text: 'Счастье', delay: 4, x: '75%', duration: 22 },
    { text: 'Улыбка', delay: 8, x: '25%', duration: 25 },
    { text: 'Солнышко', delay: 12, x: '65%', duration: 21 },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {words.map((word, i) => (
        <motion.div
          key={i}
          style={{ left: word.x }}
          initial={{ y: '110vh', opacity: 0 }}
          animate={{ 
            y: '-10vh', 
            opacity: [0, 0.7, 0.7, 0],
          }}
          transition={{ 
            duration: word.duration, 
            repeat: Infinity, 
            delay: word.delay,
            ease: "linear"
          }}
          className="absolute text-pink-400/70 font-serif italic font-semibold text-lg sm:text-xl whitespace-nowrap will-change-[transform,opacity]"
        >
          {word.text}
        </motion.div>
      ))}
    </div>
  );
};

const Welcome = ({ onStart }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
    setTimeout(onStart, 200);
  };

  return (
    <div className="relative min-h-[80vh] flex flex-col items-center justify-center p-4">
      <StarField />
      <FloatingWords />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center z-10 mb-12"
      >
        <motion.div 
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 4 }}
          className="inline-block mb-6 p-3 bg-pink-100/50 rounded-full text-pink-500"
        >
          <Sparkles className="w-8 h-8" />
        </motion.div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-4 px-4">
          Chào Huyền, có một món quà nhỏ vừa được gửi tới em...
        </h1>
        <TypingText text="Для тебя ♡" />
        <p className="text-slate-500 italic max-w-sm mx-auto px-6">
          Mong là niềm vui nhỏ này sẽ khiến ngày hôm nay của em nhẹ nhàng hơn một chút.
        </p>
      </motion.div>

      <motion.div 
        className="relative cursor-pointer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={!isOpen ? handleOpen : undefined}
      >
        <AnimatePresence mode="wait">
          {!isOpen ? (
            <motion.div
              key="closed"
              initial={{ rotate: -5 }}
              animate={{ 
                rotate: [ -5, 5, -5 ],
                y: [ 0, -15, 0 ]
              }}
              transition={{ 
                rotate: { repeat: Infinity, duration: 4, ease: "easeInOut" },
                y: { repeat: Infinity, duration: 3, ease: "easeInOut" }
              }}
              exit={{ scale: 2, opacity: 0, rotate: 0 }}
              className="relative w-48 h-32 sm:w-64 sm:h-40"
            >
              {/* Envelope Body */}
              <div className="absolute inset-0 bg-pink-200 rounded-lg shadow-2xl border-2 border-pink-300 flex items-center justify-center overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full border-t-[40px] sm:border-t-[60px] border-t-pink-100/80 border-l-[96px] sm:border-l-[128px] border-l-transparent border-r-[96px] sm:border-r-[128px] border-r-transparent" />
                <Heart className="text-pink-500 fill-pink-500 w-10 h-10 sm:w-12 sm:h-12 z-10 drop-shadow-md" />
              </div>
              <motion.div 
                animate={{ opacity: [0, 1, 0], scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute -top-4 -right-4 bg-yellow-400 text-white p-2 rounded-full shadow-lg"
              >
                <Sparkles size={16} />
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ scale: 0, opacity: 0, rotate: -20 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              className="flex flex-col items-center"
            >
              <motion.div 
                animate={{ 
                  scale: [1, 1.5, 30],
                  opacity: [1, 1, 0]
                }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="w-16 h-16 bg-pink-400 rounded-full flex items-center justify-center text-white"
              >
                <Heart fill="currentColor" size={32} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        className="mt-16 text-[10px] uppercase tracking-[0.4em] text-slate-500 font-medium"
      >
        Click to open message
      </motion.p>
    </div>
  );
};

export default Welcome;
