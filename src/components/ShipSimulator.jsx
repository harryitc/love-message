import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, FastForward, Navigation, Coffee, Send, Home, Loader2 } from 'lucide-react';
import { APP_CONFIG } from '../utils/constants';

// Lộ trình mẫu: Quanh khu vực Nhà Hát Lớn Hà Nội (Tạo cảm giác lãng mạn)
const ROMANTIC_ROUTE = [
  [21.0242, 105.8535], [21.0245, 105.8540], [21.0250, 105.8545], 
  [21.0255, 105.8550], [21.0260, 105.8555], [21.0265, 105.8560],
  [21.0270, 105.8565], [21.0275, 105.8568], [21.0280, 105.8570],
  [21.0285, 105.8572], [21.0290, 105.8570], [21.0295, 105.8565],
  [21.0300, 105.8560], [21.0305, 105.8555], [21.0310, 105.8550],
  [21.0312, 105.8542], [21.0310, 105.8535], [21.0305, 105.8530],
  [21.0300, 105.8525], [21.0295, 105.8520], [21.0290, 105.8515]
];

const ShipSimulator = ({ playSFX }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [speed, setSpeed] = useState(1000); // ms per step
  const [isReady, setIsReady] = useState(false);
  const [activeShipment, setActiveShipment] = useState(false);
  
  const socketRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    // Connect Socket
    socketRef.current = io(APP_CONFIG.BACKEND_URL);
    
    socketRef.current.on('shipmentStatus', (data) => {
      setActiveShipment(data.active);
    });

    socketRef.current.on('shipmentStarted', () => setActiveShipment(true));
    socketRef.current.on('shipmentStopped', () => {
      setActiveShipment(false);
      setIsPlaying(false);
    });

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startShipment = async () => {
    try {
      const res = await fetch(`${APP_CONFIG.BACKEND_URL}/api/ship/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lat: ROMANTIC_ROUTE[0][0],
          lng: ROMANTIC_ROUTE[0][1],
          drink: "Trà sữa Matcha (Demo Mode)",
          message: "Mèo máy đang bay thử nghiệm nè! 🚀"
        })
      });
      if (res.ok) {
        setIsReady(true);
        setCurrentIndex(0);
        if (playSFX) playSFX('success');
      }
    } catch (e) {
      alert("Không kết nối được server!");
    }
  };

  const toggleSimulation = () => {
    if (isPlaying) {
      clearInterval(timerRef.current);
    } else {
      timerRef.current = setInterval(() => {
        setCurrentIndex(prev => {
          const next = (prev + 1) % ROMANTIC_ROUTE.length;
          // Phát tọa độ giả lập qua Socket kèm timestamp
          if (socketRef.current) {
            socketRef.current.emit('updateLocation', {
              lat: ROMANTIC_ROUTE[next][0],
              lng: ROMANTIC_ROUTE[next][1],
              t: Date.now()
            });
          }
          return next;
        });
      }, speed);
    }
    setIsPlaying(!isPlaying);
  };

  const resetSimulation = () => {
    setCurrentIndex(0);
    if (socketRef.current) {
      socketRef.current.emit('updateLocation', {
        lat: ROMANTIC_ROUTE[0][0],
        lng: ROMANTIC_ROUTE[0][1]
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 flex flex-col items-center justify-center space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black tracking-tighter text-pink-400">ASTRO-SIMULATOR</h1>
        <p className="text-slate-400 text-sm font-medium uppercase tracking-[0.2em]">Bảng điều khiển mô phỏng vận chuyển</p>
      </div>

      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 space-y-8 shadow-2xl">
        {!activeShipment ? (
          <div className="space-y-6 text-center py-10">
            <div className="w-20 h-20 bg-pink-500/10 rounded-3xl flex items-center justify-center text-pink-500 mx-auto border border-pink-500/20">
              <Navigation size={40} />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold">Chưa có hành trình nào</h2>
              <p className="text-slate-400 text-sm leading-relaxed px-4">
                Nhấn nút bên dưới để khởi tạo một đơn hàng ảo và bắt đầu mô phỏng.
              </p>
            </div>
            <button 
              onClick={startShipment}
              className="w-full py-4 bg-pink-500 text-white font-black rounded-2xl shadow-lg shadow-pink-500/20 active:scale-95 transition-all uppercase tracking-widest text-xs"
            >
              KHỞI TẠO ĐƠN HÀNG DEMO
            </button>
          </div>
        ) : (
          <>
            {/* Status Card */}
            <div className="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/5">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-green-500/20 rounded-xl text-green-400">
                  <Loader2 className="animate-spin" size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase">Trạng thái</p>
                  <p className="text-sm font-bold text-green-400">Đang phát tín hiệu Live</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-slate-500 uppercase">Bước</p>
                <p className="text-sm font-mono font-bold">{currentIndex + 1} / {ROMANTIC_ROUTE.length}</p>
              </div>
            </div>

            {/* Controls */}
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={toggleSimulation}
                className={`py-6 rounded-3xl flex flex-col items-center justify-center gap-3 transition-all border-2 ${
                  isPlaying ? 'bg-amber-500/10 border-amber-500/50 text-amber-500' : 'bg-pink-500/10 border-pink-500/50 text-pink-500'
                }`}
              >
                {isPlaying ? <Pause size={32} /> : <Play size={32} />}
                <span className="text-[10px] font-black uppercase tracking-widest">{isPlaying ? "Tạm dừng" : "Chạy tiếp"}</span>
              </button>

              <button 
                onClick={resetSimulation}
                className="bg-slate-800/50 border-2 border-slate-700 rounded-3xl flex flex-col items-center justify-center gap-3 text-slate-400 hover:text-white hover:border-slate-500 transition-all"
              >
                <RotateCcw size={32} />
                <span className="text-[10px] font-black uppercase tracking-widest">Làm mới</span>
              </button>
            </div>

            {/* Speed Control */}
            <div className="space-y-4 pt-4">
              <div className="flex justify-between items-center px-2">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tốc độ bay</span>
                <span className="text-xs font-bold text-pink-400">{speed === 2000 ? "Đi bộ" : speed === 1000 ? "Scooter" : "Tên lửa"}</span>
              </div>
              <div className="flex gap-2">
                {[2000, 1000, 300].map((s) => (
                  <button 
                    key={s}
                    onClick={() => {
                      setSpeed(s);
                      if (isPlaying) {
                        clearInterval(timerRef.current);
                        timerRef.current = setInterval(() => {
                          setCurrentIndex(prev => (prev + 1) % ROMANTIC_ROUTE.length);
                        }, s);
                      }
                    }}
                    className={`flex-1 py-3 rounded-xl text-[10px] font-black transition-all ${
                      speed === s ? 'bg-pink-500 text-white' : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {s === 2000 ? "X0.5" : s === 1000 ? "X1" : "X3"}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-6">
              <button 
                onClick={async () => {
                  await fetch(`${APP_CONFIG.BACKEND_URL}/api/ship/stop`, { method: 'POST' });
                  window.location.reload();
                }}
                className="w-full py-4 bg-red-500/10 text-red-500 border-2 border-red-500/20 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
              >
                KẾT THÚC DEMO
              </button>
            </div>
          </>
        )}
      </div>

      <div className="flex gap-4">
        <button 
          onClick={() => window.open('/ship-love', '_blank')}
          className="px-6 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all"
        >
          Mở tab Tracker 👁️
        </button>
        <button 
          onClick={() => window.location.href = '/'}
          className="px-6 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all"
        >
          Về trang chủ 🏠
        </button>
      </div>

      <p className="text-[9px] text-slate-600 font-bold uppercase tracking-[0.4em]">Simulator v1.0 • Astro-Tracker Engine</p>
    </div>
  );
};

export default ShipSimulator;
