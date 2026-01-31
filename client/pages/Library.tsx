import React from 'react';
import { MOCK_PLAYLISTS } from '../constants';
import { Music } from 'lucide-react';

const Library: React.FC = () => {
  return (
    <div className="p-6 pb-32 bg-neutral-900 min-h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Your Library</h2>
        <div className="flex gap-2">
          <span className="bg-neutral-800 px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-neutral-700">Playlists</span>
          <span className="bg-neutral-800 px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-neutral-700">Artists</span>
          <span className="bg-neutral-800 px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-neutral-700">Albums</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {/* Liked Songs Entry */}
        <div className="flex items-center gap-4 p-2 hover:bg-neutral-800 rounded-lg cursor-pointer transition">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-700 to-blue-400 flex items-center justify-center rounded shadow-lg">
                <Music className="text-white" />
            </div>
            <div>
                <h3 className="font-semibold text-white">Liked Songs</h3>
                <p className="text-sm text-neutral-400">Playlist • 142 songs</p>
            </div>
        </div>

        {MOCK_PLAYLISTS.map(playlist => (
          <div key={playlist.id} className="flex items-center gap-4 p-2 hover:bg-neutral-800 rounded-lg cursor-pointer transition">
            <img src={playlist.coverUrl} alt={playlist.name} className="w-16 h-16 object-cover rounded shadow-lg" />
            <div>
              <h3 className="font-semibold text-white">{playlist.name}</h3>
              <p className="text-sm text-neutral-400">Playlist • You</p>
            </div>
          </div>
        ))}
        
        {/* Placeholder mock entries to fill space */}
        {[1, 2, 3, 4, 5].map((i) => (
             <div key={i} className="flex items-center gap-4 p-2 hover:bg-neutral-800 rounded-lg cursor-pointer transition">
                <div className="w-16 h-16 bg-neutral-800 flex items-center justify-center rounded">
                    <Music className="text-neutral-600" />
                </div>
                <div>
                <h3 className="font-semibold text-white">My Playlist #{i}</h3>
                <p className="text-sm text-neutral-400">Playlist • You</p>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default Library;
