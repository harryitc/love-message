import { useState, useEffect, useCallback, useRef } from 'react';

const SOUNDS = {
  bgm: '/sounds/bgm.mp3',
  click: '/sounds/click.mp3',
  transition: '/sounds/transition.wav',
  success: '/sounds/success.mp3',
  meow: '/sounds/meow.wav',
  sos: '/sounds/sos.mp3',
  heart: '/sounds/heart.mp3',
};

const useSound = () => {
  const [isMuted, setIsMuted] = useState(() => {
    return localStorage.getItem('isMuted') === 'true';
  });
  
  const audioRefs = useRef({});
  const bgmRef = useRef(null);

  // Khởi tạo các âm thanh SFX
  useEffect(() => {
    Object.entries(SOUNDS).forEach(([name, path]) => {
      if (name === 'bgm') return;
      const audio = new Audio(path);
      audio.preload = 'auto';
      audioRefs.current[name] = audio;
    });

    // Khởi tạo BGM
    const bgm = new Audio(SOUNDS.bgm);
    bgm.loop = true;
    bgm.volume = 0.4; // Nhạc nền nhỏ hơn SFX
    bgmRef.current = bgm;

    return () => {
      // Clean up
      Object.values(audioRefs.current).forEach(audio => {
        audio.pause();
        audio.src = '';
      });
      if (bgmRef.current) {
        bgmRef.current.pause();
        bgmRef.current.src = '';
      }
    };
  }, []);

  // Cập nhật trạng thái mute
  useEffect(() => {
    localStorage.setItem('isMuted', isMuted);
    if (bgmRef.current) {
      bgmRef.current.muted = isMuted;
    }
    Object.values(audioRefs.current).forEach(audio => {
      audio.muted = isMuted;
    });
  }, [isMuted]);

  const play = useCallback((name) => {
    const audio = audioRefs.current[name];
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(e => console.log("Audio play failed:", e));
    }
  }, []);

  const playBGM = useCallback(() => {
    if (bgmRef.current && bgmRef.current.paused) {
      bgmRef.current.play().catch(e => console.log("BGM play failed:", e));
    }
  }, []);

  const stopBGM = useCallback(() => {
    if (bgmRef.current) {
      bgmRef.current.pause();
      bgmRef.current.currentTime = 0;
    }
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  return { isMuted, play, playBGM, stopBGM, toggleMute };
};

export default useSound;
