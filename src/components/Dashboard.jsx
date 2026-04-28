import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, CloudRain, Zap, Cloud, AlertCircle, BookOpen, Heart, Sparkles, X, Mail, Utensils } from 'lucide-react';

const moods = [
  { 
    id: 'happy', 
    label: 'Vui vẻ', 
    icon: <Sun className="w-8 h-8 text-pink-500" />,
    color: 'bg-pink-50 border-pink-200',
    forecast: 'Thời tiết thật tuyệt vời! Một nguồn năng lượng tích cực đang lan tỏa khắp nơi.',
    advice: 'Hãy tận hưởng khoảnh khắc này và đừng quên mỉm cười thật nhiều nhé!'
  },
  { 
    id: 'sad', 
    label: 'Hơi buồn', 
    icon: <CloudRain className="w-8 h-8 text-pink-400" />,
    color: 'bg-pink-50/80 border-pink-100',
    forecast: 'Có vẻ bầu trời trong em đang hơi âm u một chút. Mèo máy thấy lo rồi đấy.',
    advice: 'Một bản nhạc nhẹ nhàng hoặc một chút đồ ngọt có thể giúp mây tan đi đó.'
  },
  { 
    id: 'angry', 
    label: 'Hơi dỗi', 
    icon: <Zap className="w-8 h-8 text-rose-500" />,
    color: 'bg-rose-50 border-rose-200',
    forecast: 'Cảnh báo có áp thấp nhiệt đới! Sấm sét đang nổ đùng đoàng quanh đây.',
    advice: 'Hít thở sâu một chút, Mèo máy luôn sẵn sàng lắng nghe mọi phiền muộn của em.'
  },
  { 
    id: 'hungry', 
    label: 'Đang đói', 
    icon: <Cloud className="w-8 h-8 text-pink-300" />,
    color: 'bg-pink-50 border-pink-200',
    forecast: 'Dạ dày đang phát đi tín hiệu cần nạp nhiên liệu gấp để duy trì độ đáng yêu.',
    advice: 'Mèo máy đề xuất một bữa ăn ngon miệng ngay lập tức!'
  }
];

const russianWords = [
  { word: 'Милая', pinyin: 'Milaya', mean: 'Đáng yêu' },
  { word: 'Счастье', pinyin: 'Schastye', mean: 'Hạnh phúc' },
  { word: 'Улыбка', pinyin: 'Ulybka', mean: 'Nụ cười' },
  { word: 'Солнышко', pinyin: 'Solnyshko', mean: 'Ánh mặt trời nhỏ' },
  { word: 'Мечta', pinyin: 'Mechta', mean: 'Ước mơ' },
  { word: 'Любовь', pinyin: 'Lyubov', mean: 'Tình yêu' },
  { word: 'Звезда', pinyin: 'Zvezda', mean: 'Ngôi sao' }
];

const MoodEffects = ({ mood }) => {
  if (!mood) return null;

  if (mood === 'happy') {
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: -20, x: Math.random() * 100 + "%", rotate: 0, opacity: 0 }}
            animate={{ y: "110vh", rotate: 360, opacity: [0, 1, 1, 0] }}
            transition={{ duration: 5 + Math.random() * 5, repeat: Infinity, delay: Math.random() * 5 }}
            className="absolute text-pink-300/30"
          >
            <Heart size={Math.random() * 20 + 10} fill="currentColor" />
          </motion.div>
        ))}
      </div>
    );
  }

  if (mood === 'sad') {
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: -20, x: Math.random() * 100 + "%", opacity: 0 }}
            animate={{ y: "110vh", opacity: [0, 0.4, 0] }}
            transition={{ duration: 1 + Math.random() * 1, repeat: Infinity, delay: Math.random() * 2 }}
            className="absolute w-[1px] h-8 bg-pink-400/20"
          />
        ))}
      </div>
    );
  }

  return null;
};

const SecretNote = ({ isOpen, onClose, nickname }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            className="relative w-full max-w-lg bg-[#fffaf0] p-8 sm:p-12 rounded-[2rem] shadow-2xl border-t-8 border-pink-400"
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-pink-500 transition-colors"
            >
              <X size={24} />
            </button>
            
            <div className="space-y-6">
              <div className="flex items-center gap-3 text-pink-500">
                <Heart fill="currentColor" size={20} />
                <span className="font-bold tracking-widest uppercase text-sm">Một chút tâm tư...</span>
              </div>
              
              <div className="space-y-4 text-slate-700 leading-relaxed font-serif text-lg italic">
                <p>Chào {nickname || 'em'},</p>
                <p>
                  Mèo máy được tạo ra với một sứ mệnh duy nhất: Mong là mỗi khi em truy cập vào đây, 
                  những mệt mỏi ngoài kia sẽ tạm dừng lại sau cánh cửa.
                </p>
                <p>
                  Dù là lúc vui hay những khi bầu trời trong em hơi âm u, hy vọng món quà nhỏ này 
                  có thể mang lại cho em một nụ cười, một chút năng lượng tích cực, hoặc đơn giản 
                  là một sự đồng cảm nhẹ nhàng.
                </p>
                <p>
                  Cảm ơn em đã xuất hiện và làm cho thế giới này trở nên đẹp đẽ hơn. 
                  Chúc {nickname || 'em'} luôn tỏa sáng như ánh mặt trời nhỏ nhé! ☀️
                </p>
              </div>

              <div className="pt-6 border-t border-pink-100 flex justify-between items-center text-slate-400 text-xs uppercase tracking-widest font-bold">
                <span>Mèo máy của {nickname || 'em'}</span>
                <Sparkles size={16} className="text-yellow-400" />
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const Dashboard = ({ userData, playSFX, onReset }) => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [russianIndex, setRussianIndex] = useState(0);
  const [showSecret, setShowSecret] = useState(false);

  const handleMoodSelect = (mood) => {
    playSFX('click');
    setSelectedMood(mood);
  };

  const nextRussianWord = () => {
    playSFX('click');
    setRussianIndex((prev) => (prev + 1) % russianWords.length);
  };

  const openSecret = () => {
    playSFX('success');
    setShowSecret(true);
  };

  return (
    <div className={`min-h-screen transition-colors duration-1000 ${selectedMood ? moods.find(m => m.id === selectedMood.id).color.split(' ')[0] : 'bg-transparent'}`}>
      <MoodEffects mood={selectedMood?.id} />
      <SecretNote isOpen={showSecret} onClose={() => setShowSecret(false)} nickname={userData?.nickname} />
      
      <div className="max-w-2xl mx-auto p-4 space-y-8 relative z-10 pt-6 pb-20">
        <header className="text-center space-y-2">
          <div className="space-y-1">
            <motion.h2 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="text-3xl font-bold text-slate-800"
            >
              Chào {userData.nickname}! 👋
            </motion.h2>
            <p className="text-slate-600 font-medium italic">Chào mừng {userData.nickname} đến với trạm dừng chân nhỏ của riêng mình.</p>
          </div>
        </header>

        {/* Russian Gift Card */}
        <section className="bg-white/70 backdrop-blur-md rounded-[2.5rem] p-8 border-2 border-pink-100 shadow-xl shadow-pink-50/50">
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
            <AlertCircle className="w-5 h-5 text-pink-500" />
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
                  selectedMood?.id === mood.id ? mood.color + ' border-current shadow-lg' : 'bg-white/80 border-slate-100 hover:border-slate-200'
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
              className={`p-6 rounded-3xl border-2 ${selectedMood.color} space-y-4 backdrop-blur-sm`}
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

        {/* Secret Note Floating Button */}
        <motion.button
          whileHover={{ scale: 1.1, rotate: 10 }}
          whileTap={{ scale: 0.9 }}
          onClick={openSecret}
          className="fixed bottom-24 right-8 z-50 p-4 bg-pink-500 text-white rounded-full shadow-2xl shadow-pink-200 border-4 border-white flex items-center justify-center"
        >
          <Mail size={24} />
        </motion.button>

        <div className="flex flex-col items-center gap-4 py-10">
          <button 
            onClick={onReset}
            className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] hover:text-pink-400 transition-colors"
          >
            [ Bắt đầu lại hành trình ]
          </button>
          <footer className="opacity-60 text-[10px] uppercase tracking-[0.2em] text-slate-600 font-bold text-center">
            Dành tặng riêng cho Huyền &copy; 2026
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
