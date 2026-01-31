import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Repeat, Shuffle, Heart } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const Player: React.FC = () => {
  const { currentTrack, isPlaying, pause, resume, next, prev, progress, seek, duration, volume, setVolume } = usePlayer() as any; 
  // note: 'duration' is on track object in types, but audio element has actual duration. 
  // For this mock, we use track.duration.

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-neutral-800 px-4 py-3 h-24 grid grid-cols-3 gap-4 items-center z-50">
      {/* Track Info */}
      <div className="flex items-center gap-4">
        <img 
          src={currentTrack.coverUrl} 
          alt={currentTrack.title} 
          className="w-14 h-14 rounded object-cover shadow-lg"
        />
        <div className="hidden sm:block">
          <h4 className="text-white text-sm font-semibold hover:underline cursor-pointer truncate max-w-[150px]">
            {currentTrack.title}
          </h4>
          <p className="text-neutral-400 text-xs hover:underline cursor-pointer hover:text-white transition">
            {currentTrack.artist}
          </p>
        </div>
        <button className="text-neutral-400 hover:text-green-500 ml-2">
          <Heart size={18} />
        </button>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-6">
          <button className="text-neutral-400 hover:text-white transition">
            <Shuffle size={18} />
          </button>
          <button onClick={prev} className="text-neutral-400 hover:text-white transition">
            <SkipBack size={24} fill="currentColor" />
          </button>
          <button 
            onClick={isPlaying ? pause : resume} 
            className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:scale-105 transition transform text-black"
          >
            {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-0.5"/>}
          </button>
          <button onClick={next} className="text-neutral-400 hover:text-white transition">
            <SkipForward size={24} fill="currentColor" />
          </button>
          <button className="text-neutral-400 hover:text-white transition">
            <Repeat size={18} />
          </button>
        </div>
        
        <div className="flex items-center gap-2 w-full max-w-md">
          <span className="text-xs text-neutral-400 min-w-[40px] text-right">{formatTime(progress)}</span>
          <input 
            type="range" 
            min="0" 
            max={currentTrack.duration} 
            value={progress} 
            onChange={(e) => seek(Number(e.target.value))}
            className="w-full h-1 bg-neutral-600 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full hover:[&::-webkit-slider-thumb]:bg-green-500"
          />
          <span className="text-xs text-neutral-400 min-w-[40px]">{formatTime(currentTrack.duration)}</span>
        </div>
      </div>

      {/* Volume */}
      <div className="flex items-center justify-end gap-3">
        <Volume2 size={20} className="text-neutral-400" />
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.01" 
          value={volume} 
          onChange={(e) => setVolume(Number(e.target.value))}
          className="w-24 h-1 bg-neutral-600 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full hover:[&::-webkit-slider-thumb]:bg-green-500"
        />
      </div>
    </div>
  );
};

export default Player;
