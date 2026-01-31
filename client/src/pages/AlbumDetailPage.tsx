import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { albumsAPI, favoritesAPI } from '../services/api';

interface Track {
    id: number;
    title: string;
    duration: number;
    plays: number;
    filePath: string;
    genre: { name: string };
    createdAt: string;
}

interface Artist {
    user: {
        username: string;
        avatar: string | null;
    };
}

interface Album {
    id: number;
    title: string;
    coverImage: string | null;
    releaseDate: string;
    artist: Artist;
    tracks: Track[];
}

const AlbumDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [album, setAlbum] = useState<Album | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [likedTracks, setLikedTracks] = useState<number[]>([]);

    useEffect(() => {
        if (id) {
            loadAlbum(parseInt(id));
        }
    }, [id]);

    const loadAlbum = async (albumId: number) => {
        try {
            const res = await albumsAPI.getById(albumId);
            setAlbum(res.data.data);

            // Check favorites for tracks
            // In a real app, optimize this to bulk check or have the backend return 'isLiked'
            if (res.data.data.tracks.length > 0) {
                const promises = res.data.data.tracks.map((t: Track) => favoritesAPI.check(t.id));
                const results = await Promise.all(promises);
                const liked = results.map((r, i) => r.data.data.isFavorite ? res.data.data.tracks[i].id : -1).filter(id => id !== -1);
                setLikedTracks(liked);
            }

        } catch (err) {
            setError('Failed to load album');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handlePlay = (trackId: number) => {
        // Here you would integrate with the global music player state
        // For example: setQueue(album.tracks, startIndex)
        console.log('Play track', trackId);
    };

    const handleToggleFavorite = async (trackId: number) => {
        try {
            if (likedTracks.includes(trackId)) {
                await favoritesAPI.remove(trackId);
                setLikedTracks(prev => prev.filter(id => id !== trackId));
            } else {
                await favoritesAPI.add(trackId);
                setLikedTracks(prev => [...prev, trackId]);
            }
        } catch (error) {
            console.error('Failed to toggle favorite', error);
        }
    };

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (loading) return <div className="p-8 text-center text-zinc-400">Loading album...</div>;
    if (error || !album) return <div className="p-8 text-center text-red-400">{error || 'Album not found'}</div>;

    return (
        <div className="p-6">
            {/* Album Header */}
            <div className="flex flex-col md:flex-row gap-6 items-end mb-8">
                <div className="w-52 h-52 bg-zinc-800 shadow-xl rounded-md overflow-hidden shrink-0">
                    {album.coverImage ? (
                        <img src={album.coverImage} alt={album.title} className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-4xl">Album</span>
                    )}
                </div>
                <div className="flex-1">
                    <span className="text-sm font-bold uppercase tracking-wider text-green-400">Album</span>
                    <h1 className="text-4xl md:text-5xl font-black mt-2 mb-4 text-white">{album.title}</h1>
                    <div className="flex items-center gap-2 text-sm text-zinc-300">
                        {album.artist.user.avatar && (
                            <img src={album.artist.user.avatar} className="w-6 h-6 rounded-full" />
                        )}
                        <span className="font-bold text-white hover:underline cursor-pointer">
                            {album.artist.user.username}
                        </span>
                        <span>• {new Date(album.releaseDate).getFullYear()}</span>
                        <span>• {album.tracks.length} songs</span>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 mb-8">
                <button className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center hover:scale-105 transition-transform text-black">
                    <span className="font-bold text-black">Play Album</span>
                </button>
            </div>

            {/* Track List */}
            <div className="w-full">
                <div className="grid grid-cols-[auto_1fr_auto_auto] gap-4 px-4 py-2 border-b border-zinc-800 text-sm text-zinc-400 uppercase tracking-wider">
                    <div className="w-8 text-center">#</div>
                    <div>Title</div>
                    <div className="text-right">Plays</div>
                    <div className="w-16 text-center">🕒</div>
                </div>
                <div className="mt-2 text-zinc-400">
                    {album.tracks.map((track, idx) => (
                        <div
                            key={track.id}
                            className="grid grid-cols-[auto_1fr_auto_auto] gap-4 px-4 py-3 hover:bg-zinc-800/50 rounded-md group items-center transition-colors"
                        >
                            <div className="w-8 text-center flex justify-center">
                                <span className="group-hover:hidden">{idx + 1}</span>
                                <button
                                    onClick={() => handlePlay(track.id)}
                                    className="hidden group-hover:block text-white"
                                >
                                    Play
                                </button>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-white font-medium group-hover:text-green-400 transition-colors">
                                    {track.title}
                                </span>
                                <span className="text-xs">{track.genre.name}</span>
                            </div>
                            <div className="text-right text-xs">
                                {track.plays.toLocaleString()}
                            </div>
                            <div className="w-16 text-center flex items-center justify-center gap-4">
                                <button
                                    onClick={() => handleToggleFavorite(track.id)}
                                    className={`${likedTracks.includes(track.id) ? 'text-green-500' : 'text-zinc-600 hover:text-white'} opacity-0 group-hover:opacity-100 transition-all`}
                                >
                                    Like
                                </button>
                                <span>{formatDuration(track.duration)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AlbumDetailPage;
