import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wifi, 
  WifiOff, 
  Database, 
  Navigation, 
  Play, 
  Pause, 
  RotateCcw,
  CheckCircle2,
  Terminal,
  Activity,
  MapPin,
  Flag,
  Gauge
} from 'lucide-react';
import AstroCat from './AstroCat';
import { addGPSPoint, getAllGPSPoints, clearGPSPoints, initDB } from '../utils/db';

const OfflineSyncDemo = ({ playSFX }) => {
  const [isForcedOffline, setIsForcedOffline] = useState(false);
  const [buffer, setBuffer] = useState([]);
  const [currentPos, setCurrentPos] = useState({ lat: 21.0285, lng: 105.8542 });
  const [destination, setDestination] = useState(null);
  const [speed, setSpeed] = useState(40); // km/h
  const [plannedPath, setPlannedPath] = useState([]);
  const [isAutoMoving, setIsAutoMoving] = useState(false);
  const [syncStatus, setSyncStatus] = useState('idle');
  const [routeStats, setRouteStats] = useState({ distance: 0, eta: 0 });
  const [logs, setLogs] = useState([]);

  const mapRef = useRef(null);
  const startMarkerRef = useRef(null);
  const endMarkerRef = useRef(null);
  const plannedPolylineRef = useRef(null);
  const actualPolylineRef = useRef(null);
  const moveInterval = useRef(null);
  const pathQueue = useRef([]);

  const addLog = (msg, type = 'info') => {
    setLogs(prev => [{ id: Date.now(), msg, type }, ...prev].slice(0, 10));
  };

  // Thuật toán Haversine tính khoảng cách (mét)
  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3;
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;
    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ/2) * Math.sin(Δλ/2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  };

  // Tính toán lộ trình qua OSRM API
  const calculateRoute = async (start, end) => {
    if (!start || !end) return;
    try {
      const response = await fetch(`https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`);
      const data = await response.json();
      
      if (data.routes && data.routes[0]) {
        const coords = data.routes[0].geometry.coordinates.map(c => ({ lat: c[1], lng: c[0] }));
        setPlannedPath(coords);
        pathQueue.current = [...coords];
        
        const distKm = data.routes[0].distance / 1000;
        const etaMin = (distKm / speed) * 60;
        setRouteStats({ distance: distKm.toFixed(2), eta: Math.round(etaMin) });
        
        if (plannedPolylineRef.current) plannedPolylineRef.current.setLatLngs(coords.map(p => [p.lat, p.lng]));
        addLog(`Route updated: ${distKm.toFixed(2)}km calculated.`, 'info');
      }
    } catch (err) {
      addLog("Failed to fetch route. Check internet.", "warn");
    }
  };

  // Khởi tạo Map
  useEffect(() => {
    if (!mapRef.current && window.L) {
      mapRef.current = window.L.map('map-demo', { 
        zoomControl: true, 
        attributionControl: false 
      }).setView([currentPos.lat, currentPos.lng], 16);
      
      window.L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', { 
        maxZoom: 19 
      }).addTo(mapRef.current);

      // Planned Path (Dashed slate)
      plannedPolylineRef.current = window.L.polyline([], { 
        color: '#64748b', 
        weight: 2,
        dashArray: '5, 10',
        opacity: 0.5
      }).addTo(mapRef.current);

      // Actual Path (Solid blue)
      actualPolylineRef.current = window.L.polyline([], { 
        color: '#3b82f6', 
        weight: 4,
        opacity: 0.8
      }).addTo(mapRef.current);

      // Start Marker (Draggable)
      startMarkerRef.current = window.L.marker([currentPos.lat, currentPos.lng], {
        draggable: true,
        icon: window.L.divIcon({
          html: `<div class="cat-marker-minimal"><img src="/cat-marker.svg" style="width: 32px; height: 32px; filter: drop-shadow(0 0 5px rgba(59, 130, 246, 0.5));"/></div>`,
          className: 'custom-div-icon',
          iconSize: [32, 32],
          iconAnchor: [16, 32]
        })
      }).addTo(mapRef.current);

      startMarkerRef.current.on('dragend', (e) => {
        const newPos = e.target.getLatLng();
        setCurrentPos({ lat: newPos.lat, lng: newPos.lng });
        addLog("Start position adjusted.", "info");
      });

      // End Marker (Draggable - click to set)
      mapRef.current.on('click', (e) => {
        const { lat, lng } = e.latlng;
        setDestination({ lat, lng });
        
        if (!endMarkerRef.current) {
          endMarkerRef.current = window.L.marker([lat, lng], {
            draggable: true,
            icon: window.L.divIcon({
              html: `<div class="destination-marker"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg></div>`,
              className: 'custom-div-icon',
              iconSize: [24, 24],
              iconAnchor: [4, 24]
            })
          }).addTo(mapRef.current);

          endMarkerRef.current.on('dragend', (e) => {
            setDestination(e.target.getLatLng());
          });
        } else {
          endMarkerRef.current.setLatLng([lat, lng]);
        }
      });
    }
  }, []);

  // Update Route when points change
  useEffect(() => {
    if (currentPos && destination) {
      calculateRoute(currentPos, destination);
    }
  }, [destination]);

  // Sync buffer stats
  useEffect(() => {
    const interval = setInterval(async () => {
      const points = await getAllGPSPoints();
      setBuffer(points);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Logic di chuyển mượt mà dựa trên tốc độ
  const moveStep = useCallback(async () => {
    if (pathQueue.current.length === 0) {
      setIsAutoMoving(false);
      addLog("Destination reached!", "success");
      return;
    }

    const TICK_RATE = 500; // 500ms
    const distanceToMove = (speed / 3.6) * (TICK_RATE / 1000); // meters per tick
    
    let remainingDistance = distanceToMove;
    let newLat = currentPos.lat;
    let newLng = currentPos.lng;

    while (remainingDistance > 0 && pathQueue.current.length > 0) {
      const target = pathQueue.current[0];
      const distToTarget = getDistance(newLat, newLng, target.lat, target.lng);

      if (distToTarget <= remainingDistance) {
        // Đến được điểm nút tiếp theo
        newLat = target.lat;
        newLng = target.lng;
        remainingDistance -= distToTarget;
        pathQueue.current.shift();
      } else {
        // Di chuyển một phần quãng đường tới điểm nút
        const ratio = remainingDistance / distToTarget;
        newLat += (target.lat - newLat) * ratio;
        newLng += (target.lng - newLng) * ratio;
        remainingDistance = 0;
      }
    }

    const newPoint = { lat: newLat, lng: newLng, t: Date.now() };
    setCurrentPos({ lat: newLat, lng: newLng });

    // Update Map
    if (startMarkerRef.current) startMarkerRef.current.setLatLng([newLat, newLng]);
    if (actualPolylineRef.current) actualPolylineRef.current.addLatLng([newLat, newLng]);
    if (mapRef.current) mapRef.current.panTo([newLat, newLng]);

    // Offline Sync Logic
    await addGPSPoint(newPoint);
    if (!isForcedOffline) {
      setSyncStatus('syncing');
      setTimeout(async () => {
        await clearGPSPoints();
        setSyncStatus('success');
        setTimeout(() => setSyncStatus('idle'), 300);
      }, 200);
    }
  }, [currentPos, speed, isForcedOffline]);

  useEffect(() => {
    if (isAutoMoving) {
      moveInterval.current = setInterval(moveStep, 500);
    } else {
      clearInterval(moveInterval.current);
    }
    return () => clearInterval(moveInterval.current);
  }, [isAutoMoving, moveStep]);

  const handleToggleNetwork = async () => {
    const nextState = !isForcedOffline;
    setIsForcedOffline(nextState);
    if (!nextState) {
      const points = await getAllGPSPoints();
      if (points.length > 0) {
        setSyncStatus('syncing');
        addLog(`Reconnected. Batch syncing ${points.length} points...`, 'info');
        setTimeout(async () => {
          await clearGPSPoints();
          addLog(`Batch sync complete. Journey restored.`, 'success');
          setSyncStatus('success');
          if (playSFX) playSFX('success');
          setTimeout(() => setSyncStatus('idle'), 1500);
        }, 1200);
      }
    }
  };

  const resetDemo = async () => {
    await clearGPSPoints();
    if (actualPolylineRef.current) actualPolylineRef.current.setLatLngs([]);
    if (plannedPolylineRef.current) plannedPolylineRef.current.setLatLngs([]);
    setDestination(null);
    setPlannedPath([]);
    if (endMarkerRef.current) {
      endMarkerRef.current.remove();
      endMarkerRef.current = null;
    }
    addLog("Simulator reset.", 'info');
  };

  return (
    <div className="h-screen w-full bg-slate-950 flex flex-col font-sans text-slate-300">
      <header className="h-14 bg-slate-900 border-b border-white/5 px-6 flex items-center justify-between z-20 shadow-xl">
        <div className="flex items-center gap-3">
          <Activity size={18} className="text-blue-500" />
          <h1 className="font-bold text-sm tracking-tight text-white uppercase">Astro-Lab Simulation</h1>
          <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded font-mono border border-blue-500/20">V3.6-ROUTING</span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/5">
            <div className={`w-1.5 h-1.5 rounded-full ${isForcedOffline ? 'bg-amber-500 animate-pulse' : 'bg-green-500'} shadow-[0_0_8px_currentColor]`} />
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{isForcedOffline ? 'Link Dead' : 'Link Active'}</span>
          </div>
          <button onClick={() => window.location.href = '/'} className="text-slate-500 hover:text-white transition-colors"><RotateCcw size={16} /></button>
        </div>
      </header>

      <div className="flex-grow flex overflow-hidden">
        <aside className="w-80 bg-slate-900 border-r border-white/5 flex flex-col z-10 shadow-2xl overflow-y-auto">
          {/* Network Control */}
          <div className="p-5 border-b border-white/5">
            <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Network Jammer</h2>
            <button 
              onClick={handleToggleNetwork}
              className={`w-full py-3 rounded-lg border text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                isForcedOffline 
                ? 'bg-amber-500 text-slate-950 border-amber-500' 
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              {isForcedOffline ? <WifiOff size={14} /> : <Wifi size={14} />}
              {isForcedOffline ? 'Restore Connection' : 'Kill Connection'}
            </button>
          </div>

          {/* Speed & Stats */}
          <div className="p-5 border-b border-white/5 space-y-5">
            <div className="flex justify-between items-center">
              <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-blue-400">Velocity Control</h2>
              <Gauge size={12} className="text-blue-500" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span>Current Speed</span>
                <span className="text-white font-bold">{speed} km/h</span>
              </div>
              <input 
                type="range" min="5" max="120" step="5" value={speed} 
                onChange={(e) => setSpeed(parseInt(e.target.value))}
                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                <p className="text-[9px] font-bold text-slate-500 uppercase">Distance</p>
                <p className="text-lg font-mono font-black text-white">{routeStats.distance} <span className="text-[9px]">km</span></p>
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                <p className="text-[9px] font-bold text-slate-500 uppercase">Est. Time</p>
                <p className="text-lg font-mono font-black text-white">{routeStats.eta} <span className="text-[9px]">min</span></p>
              </div>
            </div>
          </div>

          {/* Movement Controls */}
          <div className="p-5 border-b border-white/5 space-y-4">
            <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Flight Operations</h2>
            {!destination ? (
              <div className="p-4 border border-dashed border-white/10 rounded-xl text-center">
                <MapPin size={16} className="mx-auto mb-2 text-slate-600" />
                <p className="text-[10px] text-slate-500 font-medium italic">Click on map to set destination</p>
              </div>
            ) : (
              <button 
                onClick={() => setIsAutoMoving(!isAutoMoving)}
                className={`w-full py-4 rounded-xl text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${
                  isAutoMoving ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                }`}
              >
                {isAutoMoving ? <Pause size={18} /> : <Play size={18} />}
                {isAutoMoving ? 'Abort Mission' : 'Initiate Delivery'}
              </button>
            )}
            <div className="space-y-2">
              <button onClick={resetDemo} className="w-full py-2 text-slate-600 hover:text-white text-[9px] font-black uppercase tracking-widest transition-colors">Reset All Simulation</button>
              <button 
                onClick={() => { throw new Error("Astro-Lab Simulated Crash: Testing Telegram Error Reporting! ⚡"); }}
                className="w-full py-2 bg-red-500/10 border border-red-500/30 text-red-500 rounded text-[9px] font-black uppercase tracking-widest hover:bg-red-500/20 transition-all"
              >
                Simulate System Crash
              </button>
            </div>
          </div>

          {/* Buffer & Logs */}
          <div className="p-5 border-b border-white/5 bg-blue-500/5">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Local Buffer</h2>
              <Database size={12} className="text-blue-500" />
            </div>
            <div className="text-3xl font-mono font-black text-white">{buffer.length} <span className="text-[10px] font-normal text-slate-500 uppercase">packets</span></div>
            <div className="mt-3 w-full h-1 bg-white/5 rounded-full overflow-hidden">
              <motion.div animate={{ width: `${Math.min(buffer.length * 5, 100)}%` }} className="h-full bg-blue-500 shadow-[0_0_10px_#3b82f6]" />
            </div>
          </div>

          <div className="flex-grow flex flex-col overflow-hidden">
            <div className="p-4 flex items-center gap-2 border-b border-white/5">
              <Terminal size={12} className="text-slate-500" />
              <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Telemetry Stream</h2>
            </div>
            <div className="flex-grow p-4 font-mono text-[9px] overflow-y-auto space-y-1 bg-black/40">
              {logs.map(log => (
                <div key={log.id} className={`${
                  log.type === 'warn' ? 'text-amber-500' :
                  log.type === 'success' ? 'text-green-500' :
                  'text-slate-500'
                }`}>
                  <span className="opacity-20 mr-2">{new Date(log.id).toLocaleTimeString([], {hour12: false})}</span>
                  {log.msg}
                </div>
              ))}
            </div>
          </div>
        </aside>

        <main className="flex-grow relative bg-slate-900">
          <div id="map-demo" className="absolute inset-0 z-0" />
          
          <div className="absolute top-4 left-4 z-10 flex gap-2 pointer-events-none">
            <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-3">
              <AstroCat state={isForcedOffline ? 'thinking' : (isAutoMoving ? 'happy' : 'idle')} className="w-10 h-10" />
              <div className="flex flex-col">
                <span className={`text-[10px] font-black uppercase tracking-widest ${isForcedOffline ? 'text-amber-500' : 'text-blue-500'}`}>
                  {isForcedOffline ? 'OFFLINE BUFFER' : (syncStatus === 'syncing' ? 'UPLOADING...' : 'LINK ESTABLISHED')}
                </span>
                <span className="text-[9px] text-slate-500 font-bold uppercase leading-none mt-0.5">
                  {isAutoMoving ? `Cruising @ ${speed}km/h` : 'Waiting for orders'}
                </span>
              </div>
            </div>
          </div>

          {/* Instructions Overlay */}
          {!destination && !isAutoMoving && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
              <div className="bg-slate-900/60 backdrop-blur px-6 py-3 rounded-full border border-white/10 text-xs font-bold text-white/50 uppercase tracking-[0.2em]">
                Click Map to set Target 🚩
              </div>
            </div>
          )}
        </main>
      </div>

      <style>{`
        .cat-marker-minimal img {
          filter: drop-shadow(0 0 10px rgba(59, 130, 246, 0.5));
          animation: hover 2s infinite ease-in-out;
        }
        @keyframes hover {
          0%, 100% { transform: translateY(0) rotate(-2deg); }
          50% { transform: translateY(-5px) rotate(2deg); }
        }
        .destination-marker {
          filter: drop-shadow(0 0 5px rgba(239, 68, 68, 0.5));
          animation: pulse 1.5s infinite;
        }
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.8; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default OfflineSyncDemo;
