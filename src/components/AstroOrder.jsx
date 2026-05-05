import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Send, Gift, Loader2, CheckCircle2, Sparkles, X } from 'lucide-react';
import AstroCat from './AstroCat';
import { sendOrderRequest } from '../utils/telegram';

const AstroOrder = ({ nickname, onBack, playSFX }) => {
  const [value, setValue] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [mascotState, setMascotState] = useState('idle');

  const handleSubmit = async () => {
    if (!value.trim()) {
      setMascotState('shook');
      return;
    }

    setIsSending(true);
    setMascotState('thinking');
    
    const ok = await sendOrderRequest(value, nickname);
    
    setIsSending(false);
    if (ok) {
      setIsSuccess(true);
      setMascotState('happy');
      if (playSFX) playSFX('success');
      setTimeout(() => {
        onBack();
      }, 3500);
    } else {
      setMascotState('shook');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6"
    >
      {/* Heavy Blur Backdrop */}
      <div className="absolute inset-0 bg-white/20 backdrop-blur-2xl" onClick={onBack} />

      {/* Compact Interaction Card */}
      <motion.div 
        initial={{ scale: 0.9, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        className="relative w-full max-w-[380px] bg-white/80 backdrop-blur-xl rounded-[3rem] shadow-[0_32px_64px_-12px_rgba(255,182,193,0.3)] border-2 border-white flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Decor */}
        <div className="absolute top-6 left-0 right-0 px-8 flex justify-between items-center z-20">
          <motion.button 
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={onBack}
            className="w-10 h-10 bg-white shadow-sm border border-pink-50 rounded-2xl flex items-center justify-center text-slate-400 hover:text-pink-500 transition-colors"
          >
            <X size={18} />
          </motion.button>
          <div className="flex items-center gap-1.5 bg-pink-500/10 px-3 py-1.5 rounded-full border border-pink-500/20">
            <Sparkles size={10} className="text-pink-500" />
            <span className="text-[9px] font-black text-pink-600 uppercase tracking-widest">Astro Service</span>
          </div>
        </div>

        {/* Mascot Peeking */}
        <div className="pt-16 pb-4 flex flex-col items-center relative">
          <motion.div 
            animate={isSuccess ? { scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] } : { y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
            className="z-10"
          >
            <AstroCat state={mascotState} className="w-40 h-40 drop-shadow-xl cursor-pointer" onClick={() => playSFX('meow')} />
          </motion.div>
          
          <AnimatePresence mode="wait">
            {!isSuccess && (
              <motion.div 
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white px-5 py-2.5 rounded-2xl shadow-sm border border-pink-100 mt-2 relative"
              >
                <p className="text-[11px] font-bold text-pink-500 italic text-center">
                  "Em muốn Mèo máy mang gì tới nào?" 🐾
                </p>
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white border-l border-t border-pink-100 rotate-45" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Interaction Form */}
        <div className="px-8 pb-10">
          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.div 
                key="input-area"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                className="space-y-4"
              >
                <div className="bg-slate-50/50 rounded-[2rem] p-1 border-2 border-slate-100 focus-within:border-pink-200 transition-all shadow-inner">
                  <textarea 
                    value={value}
                    onChange={(e) => {
                      setValue(e.target.value);
                      if (mascotState !== 'happy') setMascotState('thinking');
                    }}
                    placeholder="Ví dụ: Một ly trà sữa, nụ cười..."
                    className="w-full h-28 p-4 bg-transparent outline-none text-slate-700 font-medium text-sm resize-none placeholder:text-slate-300"
                  />
                </div>

                <button 
                  onClick={handleSubmit}
                  disabled={isSending || !value.trim()}
                  className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-black rounded-2xl shadow-lg shadow-pink-100 flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 disabled:opacity-30 transition-all uppercase tracking-widest text-[10px]"
                >
                  {isSending ? <Loader2 className="animate-spin" size={16} /> : <><Send size={14} /> Gửi yêu cầu cho Cường</>}
                </button>
              </motion.div>
            ) : (
              <motion.div 
                key="success-area"
                initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
                className="text-center py-4 space-y-4"
              >
                <div className="w-16 h-16 bg-green-50 text-green-500 rounded-3xl flex items-center justify-center mx-auto border border-green-100">
                  <CheckCircle2 size={32} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">Đã báo cho Cường!</h4>
                  <p className="text-[10px] text-slate-400 font-bold italic leading-tight uppercase tracking-tighter">
                    Em đợi một chút nhé, <br />sắp có bất ngờ tới đây! 🚀
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Subtitle */}
        <div className="bg-slate-50/80 py-3 text-center border-t border-white">
          <span className="text-[8px] font-black text-slate-300 uppercase tracking-[0.4em]">Заказать подарок</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AstroOrder;
