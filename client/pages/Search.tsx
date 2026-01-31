import React, { useState } from 'react';
import { Search as SearchIcon, Play } from 'lucide-react';
import { MOCK_TRACKS } from '../constants';
import { usePlayer } from '../context/PlayerContext';

const CATEGORIES = [
  { color: 'bg-pink-600', title: 'Music' },
  { color: 'bg-blue-600', title: 'Podcasts' },
  { color: 'bg-purple-600', title: 'Live Events' },
  { color: 'bg-green-600', title: 'Made For You' },
  { color: 'bg-red-600', title: 'New Releases' },
  { color: 'bg-yellow-600', title: 'Pop' },
  { color: 'bg-orange-600', title: 'Hip-Hop' },
  { color: 'bg-indigo-600', title: 'Rock' },
];

const Search: React.FC = () => {
  const [query, setQuery] = useState('');
  const { play } = usePlayer();

  const filteredTracks = query 
    ? MOCK_TRACKS.filter(t => 
        t.title.toLowerCase().includes(query.toLowerCase()) || 
        t.artist.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div className="p-6 pb-32 bg-neutral-900 min-h-full">
      {/* Search Input */}
      <div className="relative mb-8 max-w-md">
        <SearchIcon className="absolute left-4 top-3.5 text-neutral-900" size={24} />
        <input 
          type="text" 
          placeholder="What do you want to listen to?" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-full text-black placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-white border-none"
          autoFocus
        />
      </div>

      {query ? (
        <div>
          <h2 className="text-2xl font-bold mb-4">Top Results</h2>
          <div className="flex flex-col gap-2">
            {filteredTracks.length > 0 ? filteredTracks.map(track => (
              <div 
                key={track.id} 
                className="flex items-center justify-between p-3 hover:bg-neutral-800 rounded group cursor-pointer transition"
                onClick={() => play(track)}
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img src={track.coverUrl} alt={track.title} className="w-12 h-12 object-cover rounded" />
                    <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center rounded">
                      <Play size={16} fill="white" className="text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className={`font-medium ${'text-white'}`}>{track.title}</h3>
                    <p className="text-sm text-neutral-400">{track.artist}</p>
                  </div>
                </div>
                <span className="text-sm text-neutral-400">
                  {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
                </span>
              </div>
            )) : (
              <p className="text-neutral-400">No tracks found for "{query}"</p>
            )}
          </div>
        </div>
      ) : (
        <div>
           <h2 className="text-2xl font-bold mb-4">Browse All</h2>
           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {CATEGORIES.map((cat, idx) => (
                <div key={idx} className={`${cat.color} h-40 rounded-lg p-4 relative overflow-hidden cursor-pointer hover:scale-[1.02] transition shadow-lg`}>
                  <h3 className="text-2xl font-bold">{cat.title}</h3>
                  {/* Decorative rotation for style */}
                  <div className="absolute -bottom-2 -right-4 w-24 h-24 bg-black/20 rotate-[25deg] transform translate-y-2 translate-x-2 rounded shadow-2xl" />
                </div>
              ))}
           </div>
        </div>
      )}
    </div>
  );
};

export default Search;
