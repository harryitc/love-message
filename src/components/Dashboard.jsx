import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, CloudRain, Zap, Cloud, AlertCircle, Utensils, MapPin, BookOpen, Heart } from 'lucide-react';

const moods = [
  { 
    id: 'happy', 
    label: 'Vui vẻ', 
    icon: <Sun className="w-8 h-8 text-yellow-500" />,
    color: 'bg-yellow-50 border-yellow-200',
    forecast: 'Thời tiết thật tuyệt vời! Một nguồn năng lượng tích cực đang lan tỏa khắp nơi.',
    advice: 'Hãy tận hưởng khoảnh khắc này và đừng quên mỉm cười thật nhiều nhé!'
  },
  { 
    id: 'sad', 
    label: 'Hơi buồn', 
    icon: <CloudRain className="w-8 h-8 text-blue-500" />,
    color: 'bg-blue-50 border-blue-200',
    forecast: 'Có vẻ bầu trời trong em đang hơi âm u một chút. Mèo máy thấy lo rồi đấy.',
    advice: 'Một bản nhạc nhẹ nhàng hoặc một chút đồ ngọt có thể giúp mây tan đi đó.'
  },
  { 
    id: 'angry', 
    label: 'Hơi dỗi', 
    icon: <Zap className="w-8 h-8 text-red-500" />,
    color: 'bg-red-50 border-red-200',
    forecast: 'Cảnh báo có áp thấp nhiệt đới! Sấm sét đang nổ đùng đoàng quanh đây.',
    advice: 'Hít thở sâu một chút, Mèo máy luôn sẵn sàng lắng nghe mọi phiền muộn của em.'
  },
  { 
    id: 'hungry', 
    label: 'Đang đói', 
    icon: <Cloud className="w-8 h-8 text-slate-500" />,
    color: 'bg-slate-100 border-slate-300',
    forecast: 'Dạ dày đang phát đi tín hiệu cần nạp nhiên liệu gấp để duy trì độ đáng yêu.',
    advice: 'Mèo máy đề xuất một bữa ăn ngon miệng ngay lập tức!'
  }
];

const russianWords = [
  { word: 'Милая', pinyin: 'Milaya', mean: 'Đáng yêu' },
  { word: 'Счастье', pinyin: 'Schastye', mean: 'Hạnh phúc' },
  { word: 'Улыбка', pinyin: 'Ulybka', mean: 'Nụ cười' },
  { word: 'Солнышко', pinyin: 'Solnyshko', mean: 'Ánh mặt trời nhỏ' },
  { word: 'Мечта', pinyin: 'Mechta', mean: 'Ước mơ' },
  { word: 'Любовь', pinyin: 'Lyubov', mean: 'Tình yêu' },
  { word: 'Звезда', pinyin: 'Zvezda', mean: 'Ngôi sao' }
];

const Dashboard = ({ userData, playSFX }) => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [showSOS, setShowSOS] = useState(false);
  const [russianIndex, setRussianIndex] = useState(0);

  const handleMoodSelect = (mood) => {
    playSFX('click');
    setSelectedMood(mood);
  };

  const handleSOS = () => {
    playSFX('sos');
    setShowSOS(!showSOS);
  };

  const nextRussianWord = () => {
    playSFX('click');
    setRussianIndex((prev) => (prev + 1) % russianWords.length);
  };

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
        <p className="text-slate-600 font-medium italic">Chào mừng Huyền đến với trạm dừng chân nhỏ của riêng mình.</p>
      </header>

      {/* Russian Gift Card */}
      <section className="bg-white/60 backdrop-blur-md rounded-[2.5rem] p-8 border-2 border-pink-100 shadow-xl shadow-pink-50/50">
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="text-pink-500 w-6 h-6" />
          <h3 className="text-lg font-bold text-slate-700">Món quà ngôn ngữ từ Mèo máy</h3>
        </div>
        
        <div className="flex flex-col items-center text-center space-y-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={russianIndex}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="space-y-2"
            >
              <h4 className="text-4xl font-serif font-bold text-pink-600 tracking-wide">
                {russianWords[russianIndex].word}
              </h4>
              <p className="text-slate-400 text-sm italic">[{russianWords[russianIndex].pinyin}]</p>
              <p className="text-xl font-medium text-slate-700">có nghĩa là: <span className="text-pink-500">{russianWords[russianIndex].mean}</span></p>
            </motion.div>
          </AnimatePresence>
          
          <button 
            onClick={nextRussianWord}
            className="mt-4 px-6 py-2 bg-pink-50 text-pink-600 rounded-full text-sm font-bold hover:bg-pink-100 transition-colors flex items-center gap-2"
          >
            KHÁM PHÁ TỪ TIẾP THEO <Heart className="w-4 h-4" />
          </button>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-blue-500" />
          Hôm nay em cảm thấy thế nào?
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {moods.map((mood) => (
            <motion.button
              key={mood.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleMoodSelect(mood)}
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
                <strong>Lời khuyên từ Mèo máy:</strong> {selectedMood.advice}
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
            <h3 className="text-2xl font-bold mb-2">GỬI TÍN HIỆU ĐẾN MÈO MÁY</h3>
            <p className="text-indigo-100 text-sm mb-6">Nhấn vào đây mỗi khi em cần một chút niềm vui hoặc năng lượng nhé!</p>
            
            <button 
              onClick={handleSOS}
              className="px-8 py-4 bg-white text-indigo-600 font-bold rounded-2xl shadow-lg flex items-center gap-2 hover:bg-indigo-50 transition-colors"
            >
              <AlertCircle className="w-5 h-5 text-red-500 animate-pulse" />
              NHẬN MỘT CHÚT BẤT NGỜ
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
                    <p className="text-xs text-amber-600 font-bold uppercase">Món quà nhỏ</p>
                    <p className="text-slate-800 font-medium">1 suất {userData.favoriteFood} dành riêng cho em</p>
                  </div>
                </div>
                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-4">
                  <div className="p-3 bg-emerald-200 rounded-xl text-emerald-700">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-emerald-600 font-bold uppercase">Trạng thái</p>
                    <p className="text-slate-800 font-medium">Luôn sẵn sàng xuất hiện khi em cần</p>
                  </div>
                </div>
              </div>
              <p className="mt-4 text-center text-sm text-slate-500 italic">
                * Mèo máy sẽ luôn tránh những điều khiến em {userData.dislike} để bảo vệ nụ cười của em.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <footer className="text-center py-10 opacity-60 text-[10px] uppercase tracking-[0.2em] text-slate-600 font-bold">
        Dành tặng riêng cho Huyền &copy; 2026
      </footer>
    </div>
  );
};

export default Dashboard;
