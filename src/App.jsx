import React, { useState, useEffect } from 'react';
import Welcome from './components/Welcome';
import SecurityGate from './components/SecurityGate';
import Calibration from './components/Calibration';
import Dashboard from './components/Dashboard';
import MascotDemo from './components/MascotDemo';
import useSound from './hooks/useSound';
import SoundControl from './components/SoundControl';

function App() {
  const [step, setStep] = useState('welcome'); // welcome, gate, calibration, dashboard
  const [userData, setUserData] = useState(null);
  const [isDemo, setIsDemo] = useState(false);
  
  const { isMuted, play, playBGM, toggleMute } = useSound();

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

  if (isDemo) {
    return (
      <div className="min-h-screen bg-[#f8fafc] p-4 flex items-center justify-center">
        <MascotDemo />
        <button 
          onClick={() => { window.location.pathname = '/'; }}
          className="fixed bottom-10 px-6 py-2 bg-slate-800 text-white rounded-full text-sm font-bold shadow-lg"
        >
          QUAY LẠI TRANG CHỦ
        </button>
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

      <main className="relative z-10 container mx-auto px-4 py-8">
        {step === 'welcome' && (
          <Welcome onStart={handleStart} />
        )}

        {step === 'gate' && (
          <SecurityGate onComplete={handleGateComplete} playSFX={play} />
        )}
        
        {step === 'calibration' && (
          <Calibration onComplete={handleCalibrationComplete} />
        )}

        {step === 'dashboard' && (
          <Dashboard userData={userData} playSFX={play} />
        )}
      </main>
    </div>
  );
}

export default App;
