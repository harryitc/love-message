import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, CloudRain, Zap, Cloud, AlertCircle, Utensils, Coffee, MapPin } from 'lucide-react';

const moods = [
  { 
    id: 'happy', 
    label: 'Vui vẻ', 
    icon: <Sun className="w-8 h-8 text-yellow-500" />,
    color: 'bg-yellow-50 border-yellow-200',
    forecast: 'Thời tiết cực đẹp! Nắng ấm tràn đầy. Khuyến cáo nên đi chơi và chụp thật nhiều ảnh xinh.',
    advice: 'Đừng quên gửi ảnh cho anh ngắm ké nhé!'
  },
  { 
    id: 'sad', 
    label: 'Hơi buồn', 
    icon: <CloudRain className="w-8 h-8 text-blue-500" />,
    color: 'bg-blue-50 border-blue-200',
    forecast: 'Áp thấp nhiệt đới đang tràn về. Có dấu hiệu mưa phùn trong mắt.',
    advice: 'Cần nạp ngay một chút đồ ngọt và nghe nhạc của anh.'
  },
  { 
    id: 'angry', 
    label: 'Đang dỗi', 
    icon: <Zap className="w-8 h-8 text-red-500" />,
    color: 'bg-red-50 border-red-200',
    forecast: 'CẢNH BÁO BÃO CẤP 12! Sấm sét nổ đùng đoàng. Vệ tinh anh đang run cầm cập.',
    advice: 'Anh xin lỗi (dù chưa biết sai gì), đừng đánh anh nhé!'
  },
  { 
    id: 'hungry', 
    label: 'Đang đói', 
    icon: <Cloud className="w-8 h-8 text-slate-500" />,
    color: 'bg-slate-100 border-slate-300',
    forecast: 'Bầu trời xám xịt, dạ dày đang phát đi tín hiệu SOS liên tục.',
    advice: 'Hệ thống đề xuất nạp năng lượng ngay lập tức.'
  }
];

const Dashboard = ({ userData }) => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [showSOS, setShowSOS] = useState(false);

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-8 mt-6">
      <header className="text-center space-y-2">
        <motion.h2 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
          className="text-3xl font-bold text-slate-800"
        >
          Chào {userData.nickname}! 👋
        </motion.h2>
        <p className="text-slate-500 italic">Trạm dự báo đang hoạt động tại tọa độ của em.</p>
      </header>

      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-blue-500" />
          Hôm nay thời tiết trong em thế nào?
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {moods.map((mood) => (
            <motion.button
              key={mood.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedMood(mood)}
              className={`p-6 rounded-2xl border-2 flex flex-col items-center gap-3 transition-colors ${
                selectedMood?.id === mood.id ? mood.color + ' border-current shadow-lg' : 'bg-white border-slate-100 hover:border-slate-200'
              }`}
            >
              {mood.icon}
              <span className="font-medium text-slate-700">{mood.label}</span>
            </motion.button>
          ))}
        </div>
      </section>

      <AnimatePresence mode="wait">
        {selectedMood && (
          <motion.div
            key={selectedMood.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`p-6 rounded-3xl border-2 ${selectedMood.color} space-y-4`}
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white rounded-xl shadow-sm">
                {selectedMood.icon}
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-lg uppercase tracking-tight">Bản tin dự báo:</h4>
                <p className="text-slate-700 leading-relaxed mt-1">{selectedMood.forecast}</p>
              </div>
            </div>
            <div className="bg-white/50 p-4 rounded-xl border border-white">
              <p className="text-sm italic text-slate-600">
                <strong>Lời khuyên từ vệ tinh:</strong> {selectedMood.advice}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <section className="pt-8 border-t border-slate-200">
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Zap className="w-24 h-24" />
          </div>
          
          <div className="relative z-10">
            <h3 className="text-2xl font-bold mb-2">CỨU HỘ KHẨN CẤP (SOS)</h3>
            <p className="text-indigo-100 text-sm mb-6">Chỉ sử dụng khi "thời tiết" quá xấu hoặc dạ dày đang kêu gào!</p>
            
            <button 
              onClick={() => setShowSOS(!showSOS)}
              className="px-8 py-4 bg-white text-indigo-600 font-bold rounded-2xl shadow-lg flex items-center gap-2 hover:bg-indigo-50 transition-colors"
            >
              <AlertCircle className="w-5 h-5 text-red-500 animate-pulse" />
              KÍCH HOẠT QUY TRÌNH GIẢI CỨU
            </button>
          </div>
        </div>

        <AnimatePresence>
          {showSOS && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-center gap-4">
                  <div className="p-3 bg-amber-200 rounded-xl text-amber-700">
                    <Utensils className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-amber-600 font-bold uppercase">Gói nhiên liệu</p>
                    <p className="text-slate-800 font-medium">1 suất {userData.favoriteFood} full topping</p>
                  </div>
                </div>
                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-4">
                  <div className="p-3 bg-emerald-200 rounded-xl text-emerald-700">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-emerald-600 font-bold uppercase">Địa điểm</p>
                    <p className="text-slate-800 font-medium">Đến tận tọa độ của em sau 15p</p>
                  </div>
                </div>
              </div>
              <p className="mt-4 text-center text-sm text-slate-500 italic">
                * Ghi chú: Tránh các tác nhân {userData.dislike} để bảo vệ hệ thống.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <footer className="text-center py-10 opacity-30 text-[10px] uppercase tracking-[0.2em] text-slate-500">
        Developed by Vệ Tinh Của Em &copy; 2026
      </footer>
    </div>
  );
};

export default Dashboard;
