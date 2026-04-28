import React, { useState } from 'react';
import SecurityGate from './components/SecurityGate';
import Calibration from './components/Calibration';
import Dashboard from './components/Dashboard';

function App() {
  const [step, setStep] = useState('gate'); // gate, calibration, dashboard
  const [userData, setUserData] = useState(null);

  const handleGateComplete = (data) => {
    setUserData(data);
    setStep('calibration');
  };

  const handleCalibrationComplete = () => {
    setStep('dashboard');
  };

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
