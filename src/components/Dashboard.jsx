import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, CloudRain, Zap, Cloud, AlertCircle, BookOpen, Heart, Sparkles, X, Mail, Utensils, CloudLightning, Fish, Satellite } from 'lucide-react';

const moods = [
  { 
    id: 'happy', 
    label: 'Vui vẻ', 
    icon: <Sun className="w-8 h-8 text-amber-500" />,
    color: 'bg-amber-50 border-amber-200',
    accent: 'text-amber-600',
    forecast: 'Thời tiết thật tuyệt vời! Một nguồn năng lượng tích cực đang lan tỏa khắp nơi.',
    advice: 'Hãy tận hưởng khoảnh khắc này và đừng quên mỉm cười thật nhiều nhé!'
  },
  { 
    id: 'sad', 
    label: 'Hơi buồn', 
    icon: <CloudRain className="w-8 h-8 text-blue-500" />,
    color: 'bg-blue-50 border-blue-200',
    accent: 'text-blue-600',
    forecast: 'Có vẻ bầu trời trong em đang hơi âm u một chút. Mèo máy thấy lo rồi đấy.',
    advice: 'Một bản nhạc nhẹ nhàng hoặc một chút đồ ngọt có thể giúp mây tan đi đó.'
  },
  { 
    id: 'angry', 
    label: 'Hơi dỗi', 
    icon: <CloudLightning className="w-8 h-8 text-rose-500" />,
    color: 'bg-rose-50 border-rose-200',
    accent: 'text-rose-600',
    forecast: 'Cảnh báo có áp thấp nhiệt đới! Sấm sét đang nổ đùng đoàng quanh đây.',
    advice: 'Hít thở sâu một chút, Mèo máy luôn sẵn sàng lắng nghe mọi phiền muộn của em.'
  },
  { 
    id: 'hungry', 
    label: 'Đang đói', 
    icon: <Fish className="w-8 h-8 text-orange-500" />,
    color: 'bg-orange-50 border-orange-200',
    accent: 'text-orange-600',
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

  const effects = {
    happy: { icon: Sun, color: 'text-amber-400/30', count: 30, size: 20 },
    sad: { isRain: true, color: 'bg-blue-400/20', count: 60 },
    angry: { icon: CloudLightning, color: 'text-rose-400/30', count: 20, size: 25 },
    hungry: { icon: Fish, color: 'text-orange-400/30', count: 25, size: 22 }
  };

  const effect = effects[mood];
  if (!effect) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-20">
      {[...Array(effect.count)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ y: -50, rotate: 0, opacity: 0 }}
          style={{ left: Math.random() * 100 + "%" }}
          animate={{ 
            y: "110vh", 
            rotate: effect.isRain ? 0 : 360, 
            opacity: effect.isRain ? [0, 0.4, 0] : [0, 0.6, 0.6, 0] 
          }}
          transition={{ 
            duration: (effect.isRain ? 0.8 : 4) + Math.random() * 4, 
            repeat: Infinity, 
            delay: Math.random() * 5 
          }}
          className={`absolute will-change-transform ${effect.color}`}
        >
          {effect.isRain ? (
            <div className="w-[2px] h-10 bg-current" />
          ) : (
            <effect.icon size={Math.random() * 10 + effect.size} fill="currentColor" />
          )}
        </motion.div>
      ))}
    </div>
  );
};

const SecretNote = ({ isOpen, onClose, nickname }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm overflow-y-auto py-10 px-4 sm:px-6">
          <div className="min-h-full flex items-center justify-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-[#fffaf0] p-8 sm:p-12 rounded-[2rem] shadow-2xl border-t-8 border-pink-400"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-pink-500 transition-colors z-10"
              >
                <X size={24} />
              </button>
              
              <div className="space-y-6">
                <div className="flex items-center gap-3 text-pink-500">
                  <Heart fill="currentColor" size={20} />
                  <span className="font-bold tracking-widest uppercase text-sm">Một chút tâm tư...</span>
                </div>
                
                <div className="space-y-4 text-slate-700 leading-relaxed text-lg italic">
                  <p>Chào Huyền,</p>
                  <p>
                    Anh làm cái “mèo máy” nhỏ này đơn giản chỉ vì nghĩ rằng: Biết đâu có lúc em ghé vào, thấy vui hơn một chút.
                  </p>
                  <p>
                    Không cần lúc nào cũng phải vui đâu, chỉ cần đôi khi có một góc nhỏ để nghỉ một xíu là được rồi.
                  </p>
                  <p>
                    Hy vọng mỗi lần em mở nó lên, sẽ có thêm một chút năng lượng tích cực, hoặc ít nhất là một cái mỉm cười nhẹ nhẹ.
                    Cảm ơn em đã dành thời gian đọc đến đây.
                  </p>
                  <p>
                    Chúc em hôm nay (và cả những ngày sau nữa) luôn có thật nhiều điều dễ thương và tỏa sáng như ánh mặt trời nhỏ nhé! ☀️
                  </p>
                </div>

                <div className="pt-6 border-t border-pink-100 flex justify-between items-center text-slate-400 text-xs uppercase tracking-widest font-bold">
                  <span>Mèo máy của Huyền</span>
                  <Sparkles size={16} className="text-yellow-400" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

const FloatingWords = () => {
  const words = [
    { text: 'Милая', delay: 0, x: '10%', duration: 15 },
    { text: 'Счастье', delay: 2, x: '80%', duration: 18 },
    { text: 'Улыбка', delay: 5, x: '30%', duration: 20 },
    { text: 'Солнышко', delay: 8, x: '70%', duration: 16 },
    { text: 'Любовь', delay: 1, x: '50%', duration: 22 },
    { text: 'Звезда', delay: 10, x: '20%', duration: 19 },
    { text: 'Мечта', delay: 4, x: '90%', duration: 17 },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {words.map((word, i) => (
        <motion.div
          key={i}
          style={{ left: word.x }}
          initial={{ y: '110vh', opacity: 0 }}
          animate={{ 
            y: '-10vh', 
            opacity: [0, 0.7, 0.7, 0],
            x: [0, (i % 2 === 0 ? 20 : -20), 0] // Hiệu ứng đung đưa ngang
          }}
          transition={{ 
            y: { duration: word.duration, repeat: Infinity, delay: word.delay, ease: "linear" },
            opacity: { duration: word.duration, repeat: Infinity, delay: word.delay, ease: "linear" },
            x: { duration: word.duration / 3, repeat: Infinity, ease: "easeInOut" }
            }}
            className="absolute text-pink-400/70 font-serif italic font-semibold text-lg sm:text-2xl whitespace-nowrap will-change-[transform,opacity]"
            >
            {word.text}
            </motion.div>      ))}
    </div>
  );
};

const Dashboard = ({ userData, playSFX, onReset }) => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [russianIndex, setRussianIndex] = useState(0);
  const [showSecret, setShowSecret] = useState(false);

  const weather = userData?.weather;

  // Hàm phiên dịch mã thời tiết Open-Meteo
  const getWeatherInfo = (code) => {
    if (code === 0) return { label: 'Trời trong xanh', icon: <Sun className="text-amber-400" />, advice: "Thời tiết đẹp như nụ cười của em vậy! 🌸", ru: "Красиво" };
    if (code >= 1 && code <= 3) return { label: 'Hơi nhiều mây', icon: <Cloud className="text-slate-400" />, advice: "Trời hơi âm u, nhưng đừng để tâm trạng bị ảnh hưởng nhé! ✨", ru: "Мило" };
    if (code >= 51 && code <= 67) return { label: 'Đang có mưa', icon: <CloudRain className="text-blue-400" />, advice: "Trời mưa rồi, em nhớ mang ô và đừng để bị ướt nhé! ☂️", ru: "Дождь" };
    if (code >= 71 && code <= 77) return { label: 'Đang rất lạnh', icon: <Zap className="text-indigo-400" />, advice: "Giữ ấm cẩn thận nha, Mèo máy lo em bị cảm lắm! 🧣", ru: "Холодно" };
    if (code >= 95) return { label: 'Có dông sét', icon: <CloudLightning className="text-purple-500" />, advice: "Sấm sét đáng sợ quá, em ở yên trong nhà cho an toàn nha! 🏠", ru: "Опасно" };
    return { label: 'Thời tiết ổn định', icon: <Sun className="text-amber-400" />, advice: "Chúc em một ngày thật bình yên và hạnh phúc! 💖", ru: "Улыбка" };
  };

  const currentStatus = weather ? getWeatherInfo(weather.weathercode) : null;
  const isHot = weather?.temperature > 30;

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

    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
    fetch(`${backendUrl}/api/track-ip`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        nickname: userData?.nickname,
        action: 'dashboard'
      })
    }).catch(err => console.log("Silent track failed", err));
  };

  return (
    <div className={`min-h-screen transition-colors px-4 py-8 duration-1000 ${selectedMood ? moods.find(m => m.id === selectedMood.id).color.split(' ')[0] : 'bg-transparent'}`}>
      <FloatingWords />
      <MoodEffects mood={selectedMood?.id} />
      <SecretNote isOpen={showSecret} onClose={() => setShowSecret(false)} nickname={userData?.nickname} />
      
      <div className="max-w-2xl mx-auto p-4 space-y-8 relative z-10 pt-6 pb-20">
        <header className="text-center space-y-4">
          <div className="space-y-1">
            <motion.h2 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="text-3xl font-bold text-slate-800"
            >
              Chào Huyền! 👋
            </motion.h2>
            <p className="text-slate-600 font-medium italic px-4">Chào mừng Huyền quay lại với trạm dừng chân của riêng mình.</p>
          </div>

          {/* Weather Station Card - Mobile Optimized */}
          {weather && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.01 }}
              className="bg-white/70 backdrop-blur-md rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 border-2 border-pink-100 shadow-xl shadow-pink-50/50 mx-2 sm:mx-4 relative overflow-hidden group"
            >
              <div className="flex items-center gap-2 sm:gap-3 mb-5 sm:mb-6">
                <div className="p-2 bg-pink-50 rounded-xl text-pink-500">
                  <Satellite size={16} className="sm:w-[18px] sm:h-[18px]" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-700">Trạm Thời tiết của Mèo máy</h3>
              </div>

              <div className="flex flex-col gap-6 sm:grid sm:grid-cols-2 sm:gap-8 items-center">
                <div className="flex items-center gap-5 sm:gap-6 justify-start w-full sm:w-auto">
                  <motion.div 
                    animate={{ y: [0, -4, 0] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                    className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-pink-50 to-purple-50 rounded-[1.5rem] sm:rounded-3xl flex items-center justify-center text-pink-500 shadow-inner border border-white shrink-0"
                  >
                    {React.cloneElement(currentStatus?.icon || <Sun />, { size: window.innerWidth < 640 ? 32 : 40 })}
                  </motion.div>
                  <div className="text-left">
                    <div className="flex items-baseline gap-0.5 sm:gap-1">
                      <span className="text-4xl sm:text-5xl font-black text-slate-800 tracking-tighter">{Math.round(weather.temperature)}°</span>
                      <span className="text-base sm:text-lg font-bold text-pink-400">C</span>
                    </div>
                    <p className="text-[11px] sm:text-sm font-bold text-slate-500 uppercase tracking-tighter mt-0.5 sm:mt-1">{currentStatus?.label}</p>
                  </div>
                </div>

                <div className="bg-pink-50/50 p-4 sm:p-5 rounded-[1.25rem] sm:rounded-[1.5rem] border border-pink-100/50 relative w-full">
                  <p className="text-xs sm:text-sm font-medium text-slate-600 italic leading-relaxed text-left">
                    "{isHot ? `Chỗ em nóng quá (${weather.temperature}°C), nhớ uống nhiều nước và đừng đi nắng lâu nha! 🥤` : currentStatus?.advice}"
                  </p>
                  <div className="absolute -bottom-2 -right-1 opacity-[0.07] font-black text-3xl sm:text-4xl italic text-pink-600 select-none pointer-events-none">
                    {currentStatus?.ru || "Погода"}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
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
