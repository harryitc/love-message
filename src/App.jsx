import React, { useState, useEffect } from 'react';
import SecurityGate from './components/SecurityGate';
import Calibration from './components/Calibration';
import Dashboard from './components/Dashboard';
import MascotDemo from './components/MascotDemo';

function App() {
  const [step, setStep] = useState('gate'); // gate, calibration, dashboard
  const [userData, setUserData] = useState(null);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    // Kiểm tra nếu URL có chứa /demo
    if (window.location.pathname === '/demo') {
      setIsDemo(true);
    }
  }, []);

  const handleGateComplete = (data) => {
    setUserData(data);
    setStep('calibration');
  };

  const handleCalibrationComplete = () => {
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

      <main className="relative z-10 container mx-auto px-4 py-8">
        {step === 'gate' && (
          <SecurityGate onComplete={handleGateComplete} />
        )}
        
        {step === 'calibration' && (
          <Calibration onComplete={handleCalibrationComplete} />
        )}

        {step === 'dashboard' && (
          <Dashboard userData={userData} />
        )}
      </main>
    </div>
  );
}

export default App;
