import { useEffect, useState } from 'react';
import api from '../services/api';
import { usePlayerStore } from '../store/usePlayerStore';

const HomePage = () => {
    const [tracks, setTracks] = useState<any[]>([]);
    const { playTrack } = usePlayerStore();

    useEffect(() => {
        // Fetch public tracks
        api.get('/tracks').then(res => {
            setTracks(res.data.data);
        }).catch(err => console.log(err));
    }, []);

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Good Morning</h1>

            <h2 className="text-xl font-bold mb-4">Trending</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {tracks.map(track => (
                    <div
                        key={track.id}
                        className="bg-surfaceHighlight p-4 rounded-md hover:bg-[#3E3E3E] transition-colors cursor-pointer group"
                        onClick={() => playTrack(track)}
                    >
                        <div className="aspect-square bg-gray-700 rounded-md mb-4 overflow-hidden relative shadow-lg">
                            {/* Placeholder or Image */}
                            {track.cover_image ?
                                <img src={`http://localhost:5000/${track.cover_image.replace(/\\/g, '/')}`} className="w-full h-full object-cover" /> :
                                <div className="w-full h-full flex items-center justify-center text-gray-500">No Image</div>
                            }
                        </div>
                        <div className="font-bold truncate text-white">{track.title}</div>
                        <div className="text-sm text-textSecondary truncate">{track.artist}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HomePage;
