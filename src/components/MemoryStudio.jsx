import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, FastForward, SkipBack, X, Film, Download, Heart } from 'lucide-react';
import AstroCat from './AstroCat';

const MemoryStudio = ({ path, drink, onClose, playSFX }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(5); // Nhanh gấp 5 lần thực tế
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const lineRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    // Khởi tạo bản đồ mini cho studio
    if (!mapRef.current) {
      mapRef.current = L.map('studio-map', {
        zoomControl: false,
        attributionControl: false,
        dragging: false,
        scrollWheelZoom: false
      }).setView([path[0].lat, path[0].lng], 16);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png').addTo(mapRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startReplay = () => {
    setIsPlaying(true);
    setCurrentIndex(0);
    if (playSFX) playSFX('transition');

    // Xóa các marker cũ nếu có
    if (markerRef.current) markerRef.current.remove();
    if (lineRef.current) lineRef.current.remove();

    markerRef.current = L.marker([path[0].lat, path[0].lng], {
      icon: L.divIcon({
        html: `<div class="studio-cat"><img src="/favicon.svg" style="width: 50px; height: 50px;" /></div>`,
        className: 'custom-div-icon',
        iconSize: [50, 50],
        iconAnchor: [25, 25]
      })
    }).addTo(mapRef.current);

    lineRef.current = L.polyline([], { color: '#ffb6c1', weight: 5, dashArray: '5, 10' }).addTo(mapRef.current);

    let idx = 0;
    timerRef.current = setInterval(() => {
      if (idx >= path.length - 1) {
        clearInterval(timerRef.current);
        setIsPlaying(false);
        if (playSFX) playSFX('success');
        return;
      }
      idx++;
      setCurrentIndex(idx);
      const pos = [path[idx].lat, path[idx].lng];
      markerRef.current.setLatLng(pos);
      lineRef.current.addLatLng(pos);
      mapRef.current.panTo(pos, { animate: true, duration: 0.2 });
    }, 100); // Phát lại nhanh
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[3000] bg-slate-950 flex flex-col items-center justify-center p-4"
    >
      {/* Phông nền Cinematic */}
      <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-white to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-white to-transparent" />
      </div>

      <div className="relative w-full max-w-4xl aspect-video bg-white rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(244,114,182,0.3)] border-8 border-white">
        <div id="studio-map" className="w-full h-full" />
        
        {/* Overlay Phim */}
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-8">
          <div className="flex justify-between items-start">
            <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
              <p className="text-[10px] font-black text-pink-400 uppercase tracking-widest">Hành trình kỷ niệm</p>
              <h3 className="text-white font-bold uppercase">{drink}</h3>
            </div>
            <button 
              onClick={onClose}
              className="pointer-events-auto p-3 bg-white/10 hover:bg-red-500 text-white rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex justify-center">
            <AnimatePresence>
              {currentIndex === path.length - 1 && !isPlaying && (
                <motion.div 
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  className="bg-white/90 backdrop-blur-md p-6 rounded-[2rem] flex flex-col items-center gap-2 border-4 border-pink-200"
                >
                  <Heart className="text-pink-500 fill-pink-500 animate-bounce" size={40} />
                  <p className="text-slate-800 font-black text-xl uppercase tracking-tighter">The End</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="w-full bg-black/40 backdrop-blur-sm h-1 rounded-full overflow-hidden">
             <motion.div 
               className="h-full bg-pink-500"
               style={{ width: `${(currentIndex / (path.length - 1)) * 100}%` }}
             />
          </div>
        </div>
      </div>

      {/* Điều khiển Studio */}
      <div className="mt-8 flex flex-col items-center gap-6 w-full max-w-md">
        <div className="flex items-center gap-4">
          <button 
            onClick={startReplay}
            disabled={isPlaying}
            className="w-16 h-16 bg-pink-500 text-white rounded-full flex items-center justify-center shadow-xl shadow-pink-500/30 hover:scale-110 active:scale-95 transition-all disabled:opacity-50"
          >
            {isPlaying ? <Loader2 className="animate-spin" /> : <Play fill="currentColor" />}
          </button>
        </div>

        <div className="space-y-2 text-center">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.3em]">Astro-Studio v1.0</p>
          <p className="text-white/60 text-[10px] italic">"Ghi lại từng bước chân, lưu giữ mọi kỷ niệm."</p>
        </div>

        <div className="flex gap-4">
           <button className="px-6 py-3 bg-white/5 border border-white/10 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-white/10 transition-all opacity-50 cursor-not-allowed">
             <Download size={14} /> Tải Video (Sắp có)
           </button>
        </div>
      </div>
    </motion.div>
  );
};

export default MemoryStudio;
