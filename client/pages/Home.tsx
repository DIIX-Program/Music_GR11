import React from 'react';
import { GREETINGS, MOCK_PLAYLISTS, MOCK_TRACKS } from '../constants';
import { usePlayer } from '../context/PlayerContext';
import { Play } from 'lucide-react';
import { Track } from '../types';

const Home: React.FC = () => {
  const { play } = usePlayer();
  const greeting = GREETINGS[Math.floor(Math.random() * GREETINGS.length)];

  return (
    <div className="p-6 pb-32 bg-gradient-to-b from-emerald-900/40 to-neutral-900 min-h-full">
      <h2 className="text-3xl font-bold mb-6">{greeting}</h2>

      {/* Quick Access Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {MOCK_PLAYLISTS.map(playlist => (
          <div key={playlist.id} className="bg-neutral-800/50 hover:bg-neutral-700 transition rounded overflow-hidden flex items-center group cursor-pointer relative">
            <img src={playlist.coverUrl} alt={playlist.name} className="w-20 h-20 object-cover shadow-lg" />
            <span className="font-bold px-4">{playlist.name}</span>
            <div className="absolute right-4 bg-green-500 rounded-full p-3 opacity-0 group-hover:opacity-100 shadow-xl transition-all translate-y-2 group-hover:translate-y-0">
               <Play size={20} fill="black" className="text-black ml-0.5" />
            </div>
          </div>
        ))}
      </div>

      {/* Section: Made For You */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold mb-4 hover:underline cursor-pointer">Made For You</h3>
        <div className="flex gap-6 overflow-x-auto pb-4">
          {MOCK_TRACKS.map((track) => (
             <TrackCard key={track.id} track={track} onPlay={() => play(track)} />
          ))}
        </div>
      </div>

      {/* Section: Recently Played */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold mb-4 hover:underline cursor-pointer">Recently Played</h3>
        <div className="flex gap-6 overflow-x-auto pb-4">
          {MOCK_TRACKS.slice().reverse().map((track) => (
             <TrackCard key={`recent-${track.id}`} track={track} onPlay={() => play(track)} />
          ))}
        </div>
      </div>
    </div>
  );
};

const TrackCard: React.FC<{ track: Track; onPlay: () => void }> = ({ track, onPlay }) => (
  <div 
    onClick={onPlay}
    className="min-w-[180px] p-4 bg-neutral-900 hover:bg-neutral-800 rounded-lg transition cursor-pointer group"
  >
    <div className="relative mb-4">
      <img src={track.coverUrl} alt={track.title} className="w-full aspect-square object-cover rounded shadow-md" />
      <div className="absolute bottom-2 right-2 bg-green-500 rounded-full p-3 opacity-0 group-hover:opacity-100 shadow-xl transition-all translate-y-2 group-hover:translate-y-0 hover:scale-105">
        <Play size={20} fill="black" className="text-black ml-0.5" />
      </div>
    </div>
    <h4 className="font-bold text-white truncate mb-1">{track.title}</h4>
    <p className="text-sm text-neutral-400 truncate">{track.artist}</p>
  </div>
);

export default Home;