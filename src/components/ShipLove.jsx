import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigation, Coffee, Heart, Home, ArrowRight, Loader2, MapPin, Send, MessageCircle, Film } from 'lucide-react';
import { TARGET_NAME, APP_CONFIG } from '../utils/constants';
import AstroCat from './AstroCat';
import MemoryStudio from './MemoryStudio';

// --- Custom Icons for Map ---
const createCatIcon = () => L.divIcon({
  html: `<div class="cat-marker"><img src="/favicon.svg" style="width: 40px; height: 40px; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));" /></div>`,
  className: 'custom-div-icon',
  iconSize: [40, 40],
  iconAnchor: [20, 40]
});

const createHomeIcon = () => L.divIcon({
  html: `<div class="home-marker bg-white p-2 rounded-full border-2 border-pink-400 shadow-lg text-pink-500"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></div>`,
  className: 'custom-div-icon',
  iconSize: [40, 40],
  iconAnchor: [20, 20]
});

const ShipLove = ({ playSFX }) => {
  const [mode, setMode] = useState('track'); // track or ship
  const [activeShipment, setActiveShipment] = useState(null);
  const [hasArrived, setHasArrived] = useState(false);
  const [showStudio, setShowStudio] = useState(false);
  const [recordedPath, setRecordedPath] = useState([]);
  const [form, setForm] = useState({ drink: '', message: '', destination: '' });
  const [isStarting, setIsStarting] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState(null);
  const [mascotState, setMascotState] = useState('idle');
  const [bubbleText, setBubbleText] = useState("");

  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const pathRef = useRef(null);
  const watchId = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('mode') === 'ship') setMode('ship');

    if (!mapRef.current) {
      mapRef.current = L.map('map', { zoomControl: false, attributionControl: false }).setView([21.0285, 105.8542], 15);
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', { maxZoom: 19 }).addTo(mapRef.current);
    }

    socketRef.current = io(APP_CONFIG.BACKEND_URL);

    socketRef.current.on('shipmentStatus', (data) => {
      if (data.active) {
        setActiveShipment(data);
        updateMap(data.lat, data.lng, data.path);
        setMascotState('happy');
        setBubbleText(`Я еду к тебе! (Anh đang mang ${data.drink} tới cho em đây!) 🐾`);
      }
    });

    socketRef.current.on('locationUpdated', (data) => updateMap(data.lat, data.lng, data.path));

    socketRef.current.on('shipmentStarted', (data) => {
      setActiveShipment(data);
      setHasArrived(false);
      updateMap(data.lat, data.lng, data.path);
      if (playSFX) playSFX('meow');
    });

    socketRef.current.on('shipmentArrived', (data) => {
      setHasArrived(true);
      setRecordedPath(data.path || []);
      setMascotState('happy');
      if (playSFX) { playSFX('success'); playSFX('meow'); }
    });

    socketRef.current.on('shipmentStopped', () => {
      setActiveShipment(null);
      setHasArrived(false);
      setIsRecording(false);
      if (markerRef.current) markerRef.current.remove();
      if (pathRef.current) pathRef.current.remove();
      markerRef.current = null;
      pathRef.current = null;
    });

    return () => {
      if (watchId.current) navigator.geolocation.clearWatch(watchId.current);
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, []);

  const updateMap = (lat, lng, path) => {
    if (!mapRef.current) return;
    const pos = [lat, lng];
    if (!markerRef.current) markerRef.current = L.marker(pos, { icon: createCatIcon() }).addTo(mapRef.current);
    else markerRef.current.setLatLng(pos);
    if (path && path.length > 1) {
      const polyCoords = path.map(p => [p.lat, p.lng]);
      if (!pathRef.current) pathRef.current = L.polyline(polyCoords, { color: '#ffb6c1', weight: 4, dashArray: '10, 10' }).addTo(mapRef.current);
      else pathRef.current.setLatLngs(polyCoords);
    }
    mapRef.current.panTo(pos, { animate: true, duration: 1 });
  };

  const startDelivery = () => {
    setIsStarting(true);
    setError(null);
    if (!navigator.geolocation) { setError("Trình duyệt không hỗ trợ GPS."); setIsStarting(false); return; }
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      try {
        const res = await fetch(`${APP_CONFIG.BACKEND_URL}/api/ship/start`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lat: latitude, lng: longitude, drink: form.drink || 'Trà sữa', message: form.message || 'Chờ chút nhé!' })
        });
        if (res.ok) {
          startWatching();
          setIsRecording(true);
        }
      } catch (err) { setError("Không thể kết nối tới server."); } finally { setIsStarting(false); }
    }, (err) => { setError("Vui lòng cho phép truy cập vị trí."); setIsStarting(false); });
  };

  const startWatching = () => {
    watchId.current = navigator.geolocation.watchPosition((position) => {
      const { latitude, longitude } = position.coords;
      if (socketRef.current) socketRef.current.emit('updateLocation', { lat: latitude, lng: longitude });
      updateMap(latitude, longitude);
    }, (err) => console.error(err), { enableHighAccuracy: true, maximumAge: 0 });
  };

  const openDirections = () => {
    if (form.destination) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(form.destination)}`;
      window.open(url, '_blank');
    } else {
      alert("Huyền ơi, nhập địa chỉ để Mèo máy chỉ đường nha! 🐾");
    }
  };

  const notifyArrival = async () => {
    await fetch(`${APP_CONFIG.BACKEND_URL}/api/ship/arrive`, { method: 'POST' });
    setIsRecording(false);
    if (playSFX) playSFX('heart');
  };

  const stopDelivery = async () => {
    if (watchId.current) navigator.geolocation.clearWatch(watchId.current);
    await fetch(`${APP_CONFIG.BACKEND_URL}/api/ship/stop`, { method: 'POST' });
    setActiveShipment(null);
    setHasArrived(false);
    setIsRecording(false);
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-slate-50 flex flex-col">
      {/* Memory Studio Overlay */}
      <AnimatePresence>
        {showStudio && (
          <MemoryStudio 
            path={recordedPath} 
            drink={activeShipment?.drink || "Món quà bí mật"} 
            onClose={() => setShowStudio(false)}
            playSFX={playSFX}
          />
        )}
      </AnimatePresence>

      {/* Live Recording Indicator */}
      <AnimatePresence>
        {isRecording && mode === 'ship' && (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="absolute top-20 left-4 z-[1001] bg-red-500 text-white px-3 py-1.5 rounded-full text-[10px] font-black uppercase flex items-center gap-2 shadow-lg"
          >
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            Live Recording Hành trình...
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {hasArrived && mode === 'track' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[2000] bg-pink-500/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
            <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", damping: 12 }} className="space-y-8">
              <div className="relative">
                <div className="absolute inset-0 bg-white/20 blur-3xl rounded-full" />
                <AstroCat state="happy" className="w-48 h-48 relative z-10" onClick={() => playSFX('meow')} />
              </div>
              <div className="space-y-4">
                <h2 className="text-4xl font-black text-white tracking-tighter">MÓN QUÀ ĐÃ ĐẾN! 🌸</h2>
                <p className="text-pink-100 text-lg font-medium italic">"{activeShipment?.message || "Chúc em một ngày ngọt ngào như món nước này nhé!"}"</p>
              </div>
              <div className="flex flex-col gap-3">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowStudio(true)} className="px-10 py-4 bg-slate-900 text-white font-black rounded-2xl shadow-xl uppercase tracking-widest text-sm flex items-center justify-center gap-2"><Film size={18} className="text-pink-400" /> Xem Phim Kỷ Niệm 🎬</motion.button>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setHasArrived(false)} className="px-10 py-4 bg-white text-pink-500 font-black rounded-2xl shadow-xl uppercase tracking-widest text-sm">Tuyệt vời quá! 💖</motion.button>
              </div>
            </motion.div>
            {[...Array(15)].map((_, i) => (
              <motion.div key={i} initial={{ y: "100vh", x: Math.random() * 100 + "vw", scale: 0 }} animate={{ y: "-10vh", scale: Math.random() * 1.5 + 0.5, rotate: 360 }} transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }} className="absolute text-white/40 pointer-events-none"><Heart fill="currentColor" size={Math.random() * 20 + 20} /></motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <div className="absolute top-0 left-0 right-0 z-[1000] p-4 flex justify-between items-center bg-white/60 backdrop-blur-md border-b border-pink-100">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-pink-100 rounded-lg text-pink-500"><Navigation size={20} className={activeShipment?.active ? "animate-pulse" : ""} /></div>
          <div><h1 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Astro-Tracker</h1><p className="text-[10px] text-pink-500 font-bold uppercase tracking-tighter">{activeShipment?.active ? "Chuyến xe đang chạy..." : "Đang chờ tín hiệu..."}</p></div>
        </div>
        <button onClick={() => window.location.href = '/'} className="p-2 text-slate-400 hover:text-pink-500 transition-colors"><Home size={20} /></button>
      </div>
      <div id="map" className="flex-grow z-0" />
      {mode === 'track' && activeShipment?.active && (
        <div className="absolute top-20 left-4 right-4 z-[1000] pointer-events-none">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4">
            <div className="relative pointer-events-auto">
              <AnimatePresence mode="wait">
                <motion.div key={bubbleText} initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} className="absolute -top-12 left-0 min-w-[150px] bg-white p-3 rounded-2xl shadow-xl border border-pink-100 text-[11px] font-bold text-pink-600 italic">{bubbleText}<div className="absolute -bottom-1.5 left-4 w-3 h-3 bg-white border-r border-b border-pink-100 rotate-45" /></motion.div>
              </AnimatePresence>
              <AstroCat state={mascotState} className="w-20 h-20 drop-shadow-2xl" onClick={() => playSFX('meow')} />
            </div>
          </motion.div>
        </div>
      )}
      <div className="absolute bottom-6 left-4 right-4 z-[1000]">
        <AnimatePresence mode="wait">
          {mode === 'ship' ? (
            !activeShipment?.active ? (
              <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="bg-white rounded-[2.5rem] p-6 shadow-2xl border-2 border-pink-100 space-y-4">
                <div className="flex items-center gap-3 mb-2"><div className="p-2 bg-purple-100 rounded-xl text-purple-600"><Coffee size={20} /></div><h2 className="font-bold text-slate-800">Chuẩn bị hành trình</h2></div>
                <div className="space-y-3">
                  <input type="text" placeholder="Hôm nay em ấy uống gì?" value={form.drink} onChange={(e) => setForm({...form, drink: e.target.value})} className="w-full px-5 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-pink-300 outline-none transition-all text-sm" />
                  <input type="text" placeholder="Địa chỉ giao tới (để mèo chỉ đường)..." value={form.destination} onChange={(e) => setForm({...form, destination: e.target.value})} className="w-full px-5 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-pink-300 outline-none transition-all text-sm" />
                  <input type="text" placeholder="Lời nhắn nhủ cho Huyền..." value={form.message} onChange={(e) => setForm({...form, message: e.target.value})} className="w-full px-5 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-pink-300 outline-none transition-all text-sm" />
                </div>
                {error && <p className="text-xs text-red-500 font-bold text-center italic">{error}</p>}
                <div className="flex gap-2">
                  <button onClick={openDirections} title="Xem chỉ đường" className="p-4 bg-slate-100 text-slate-600 rounded-2xl hover:bg-slate-200 transition-all"><MapPin size={20} /></button>
                  <button onClick={startDelivery} disabled={isStarting} className="flex-1 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black rounded-2xl shadow-lg shadow-pink-200 flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all text-xs uppercase tracking-widest">{isStarting ? <Loader2 className="animate-spin" /> : <><Send size={16} /> BẮT ĐẦU CHUYẾN XE</>}</button>
                </div>
              </motion.div>
            ) : (
              <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-slate-900 text-white rounded-[2.5rem] p-6 shadow-2xl space-y-4">
                <div className="flex justify-between items-center gap-4">
                  <div className="flex items-center gap-3"><Loader2 className="animate-spin text-pink-400" size={20} /><div><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Đang hành trình...</p><p className="text-sm font-bold truncate max-w-[120px]">Món: {activeShipment.drink}</p></div></div>
                  <div className="flex gap-2">
                    <button onClick={openDirections} className="p-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all"><MapPin size={18} /></button>
                    <button onClick={notifyArrival} className="px-4 py-2 bg-green-500 text-white rounded-xl text-[10px] font-black uppercase shadow-lg shadow-green-500/20 active:scale-95 transition-all">Đã tới nơi 📍</button>
                    <button onClick={stopDelivery} className="px-4 py-2 bg-slate-700 text-slate-300 rounded-xl text-[10px] font-black uppercase hover:bg-red-500 hover:text-white transition-all">Xong</button>
                  </div>
                </div>
              </motion.div>
            )
          ) : (
            activeShipment?.active && (
              <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white/90 backdrop-blur-md rounded-[2.5rem] p-6 shadow-2xl border-2 border-pink-100 flex items-center justify-between">
                <div className="flex items-center gap-4"><div className="w-12 h-12 bg-pink-100 rounded-2xl flex items-center justify-center text-pink-500"><Coffee size={24} /></div><div><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Mèo máy đang ship</p><p className="text-lg font-black text-slate-800 leading-none">{activeShipment.drink}</p></div></div>
                <div className="flex flex-col items-end"><Heart className="text-pink-500 fill-pink-500 animate-bounce mb-1" size={20} /><p className="text-[10px] font-bold text-pink-600 uppercase tracking-tighter italic">Đang đến với em...</p></div>
              </motion.div>
            )
          )}
        </AnimatePresence>
      </div>
      {!activeShipment?.active && mode === 'track' && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"><motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }} transition={{ repeat: Infinity, duration: 4 }} className="text-pink-200 text-6xl font-black italic opacity-20 uppercase tracking-[1em] rotate-[-20deg]">Жди меня</motion.div></div>
      )}
    </div>
  );
};

export default ShipLove;
