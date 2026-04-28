import React from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';

const SoundControl = ({ isMuted, toggleMute }) => {
  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={toggleMute}
      className="fixed bottom-6 right-6 z-[100] p-4 bg-white/80 backdrop-blur-sm border-2 border-slate-100 rounded-2xl shadow-lg text-slate-600 hover:text-pink-500 hover:border-pink-100 transition-colors"
      title={isMuted ? "Bật âm thanh" : "Tắt âm thanh"}
    >
      {isMuted ? (
        <VolumeX className="w-6 h-6" />
      ) : (
        <div className="relative">
          <Volume2 className="w-6 h-6" />
          <motion.div
            animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="absolute inset-0 bg-pink-400 rounded-full -z-10"
          />
        </div>
      )}
    </motion.button>
  );
};

export default SoundControl;
