import React, { createContext, useContext, useState, useRef, useEffect, ReactNode } from 'react';
import { PlayerContextType, Track } from '../types';
import { MOCK_TRACKS } from '../constants';

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [progress, setProgress] = useState(0);
  const [queue, setQueue] = useState<Track[]>(MOCK_TRACKS);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize Audio Object
  useEffect(() => {
    audioRef.current = new Audio();
    
    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      setProgress(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      next(); // Auto play next
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle Play/Pause side effects
  useEffect(() => {
    if (audioRef.current && currentTrack) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log("Playback interaction required", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack]);

  // Handle Volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const play = (track: Track) => {
    if (currentTrack?.id === track.id) {
      resume();
      return;
    }

    if (audioRef.current) {
      // In a real app with real URLs, we would set src here.
      // Since these are mock URLs that might not work on all networks, 
      // we check if it has a URL, otherwise we simulate playback.
      if (track.audioUrl) {
        audioRef.current.src = track.audioUrl;
      } else {
        // Fallback for demo if no URL
        console.warn("No Audio URL provided for track");
      }
      audioRef.current.load();
    }
    
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const resume = () => {
    setIsPlaying(true);
  };

  const pause = () => {
    setIsPlaying(false);
  };

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setProgress(time);
    }
  };

  const next = () => {
    if (!currentTrack) return;
    const currentIndex = queue.findIndex(t => t.id === currentTrack.id);
    const nextTrack = queue[(currentIndex + 1) % queue.length];
    play(nextTrack);
  };

  const prev = () => {
    if (!currentTrack) return;
    const currentIndex = queue.findIndex(t => t.id === currentTrack.id);
    const prevTrack = queue[(currentIndex - 1 + queue.length) % queue.length];
    play(prevTrack);
  };

  const addToQueue = (track: Track) => {
    setQueue(prev => [...prev, track]);
  };

  return (
    <PlayerContext.Provider value={{
      currentTrack,
      isPlaying,
      volume,
      progress,
      play,
      pause,
      resume,
      next,
      prev,
      seek,
      setVolume,
      queue,
      addToQueue
    }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};
