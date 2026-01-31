import { usePlayerStore } from '../../store/usePlayerStore';
import { useState } from 'react';

const MusicPlayer = () => {
    const { isPlaying, currentTrack, togglePlay } = usePlayerStore();
    const [volume, setVolume] = useState(50);
    const [progress, setProgress] = useState(0);

    const track = currentTrack || {
        title: 'No track selected',
        artist: 'StreamFlow',
        cover_image: null
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 h-20 bg-black border-t border-zinc-800 px-6 flex items-center justify-between z-50 text-white">

            {/* Track Info */}
            <div className="w-[30%] flex items-center gap-4">
                <div className="w-12 h-12 rounded bg-zinc-800 flex items-center justify-center text-zinc-500 text-xs">
                    {currentTrack ? 'Track' : 'No Track'}
                </div>
                <div className="flex flex-col overflow-hidden">
                    <span className="font-medium text-sm truncate hover:underline cursor-pointer">{track.title}</span>
                    <span className="text-xs text-zinc-400 truncate">{track.artist}</span>
                </div>
                <button className="text-zinc-400 hover:text-white text-sm ml-2">Like</button>
            </div>

            {/* Controls & Progress */}
            <div className="w-[40%] flex flex-col items-center gap-1.5 max-w-xl">
                <div className="flex items-center gap-4">
                    <button className="text-zinc-400 hover:text-white text-xs">Shuffle</button>
                    <button className="text-zinc-400 hover:text-white text-xs">Prev</button>
                    <button
                        onClick={togglePlay}
                        className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-black font-bold text-sm hover:scale-105 transition-transform"
                    >
                        {isPlaying ? 'Pause' : 'Play'}
                    </button>
                    <button className="text-zinc-400 hover:text-white text-xs">Next</button>
                    <button className="text-zinc-400 hover:text-white text-xs">Repeat</button>
                </div>

                <div className="w-full flex items-center gap-2 text-xs text-zinc-400 font-mono">
                    <span>0:00</span>
                    <div className="h-1 flex-1 bg-zinc-700 rounded-full relative cursor-pointer group">
                        <div
                            className="absolute top-0 left-0 h-full bg-white group-hover:bg-green-500 rounded-full transition-colors"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <span>3:45</span>
                </div>
            </div>

            {/* Volume */}
            <div className="w-[30%] flex justify-end items-center gap-3">
                <span className="text-xs text-zinc-400">Vol</span>
                <div className="w-24 h-1 bg-zinc-700 rounded-full relative cursor-pointer group">
                    <div
                        className="absolute top-0 left-0 h-full bg-white group-hover:bg-green-500 rounded-full transition-colors"
                        style={{ width: `${volume}%` }}
                    />
                </div>
            </div>
        </div>
    );
};

export default MusicPlayer;
