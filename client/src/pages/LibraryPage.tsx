import { useState, useEffect } from 'react';
import { playlistsAPI, favoritesAPI, albumsAPI } from '../services/api';

type TabType = 'playlists' | 'albums' | 'liked';
type ViewType = 'grid' | 'list';
type SortType = 'recent' | 'name';

interface Playlist {
    id: number;
    name: string;
    description: string | null;
    createdAt: string;
    _count?: { tracks: number };
}

interface Album {
    id: number;
    title: string;
    artistName: string;
    coverImage: string | null;
    releaseDate: string;
    trackCount: number;
}

interface LikedTrack {
    id: number;
    title: string;
    artistName: string;
    duration: number;
    favoritedAt: string;
}

const LibraryPage = () => {
    const [activeTab, setActiveTab] = useState<TabType>('playlists');
    const [viewType, setViewType] = useState<ViewType>('grid');
    const [sortBy, setSortBy] = useState<SortType>('recent');
    const [searchFilter, setSearchFilter] = useState('');
    const [loading, setLoading] = useState(false);

    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [albums, setAlbums] = useState<Album[]>([]);
    const [likedSongs, setLikedSongs] = useState<LikedTrack[]>([]);
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });

    const tabs: { key: TabType; label: string }[] = [
        { key: 'playlists', label: 'Playlists' },
        { key: 'albums', label: 'Albums' },
        { key: 'liked', label: 'Liked Songs' },
    ];

    useEffect(() => {
        loadData();
    }, [activeTab]);

    const loadData = async (page = 1) => {
        setLoading(true);
        try {
            if (activeTab === 'playlists') {
                const res = await playlistsAPI.getAll({ page, limit: 20 });
                setPlaylists(res.data.data.playlists || res.data.data || []);
                setPagination({ page: res.data.data.page || 1, totalPages: res.data.data.totalPages || 1 });
            } else if (activeTab === 'albums') {
                const res = await albumsAPI.getAll({ page, limit: 20 });
                setAlbums(res.data.data.albums || []);
                setPagination({ page: res.data.data.page || 1, totalPages: res.data.data.totalPages || 1 });
            } else if (activeTab === 'liked') {
                const res = await favoritesAPI.getAll({ page, limit: 50 });
                setLikedSongs(res.data.data.favorites || []);
                setPagination({ page: res.data.data.page || 1, totalPages: res.data.data.totalPages || 1 });
            }
        } catch (error) {
            console.error('Failed to load data:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const sortItems = <T extends { id: number; name?: string; title?: string; createdAt?: string; favoritedAt?: string }>(items: T[]): T[] => {
        return [...items].sort((a, b) => {
            const getSortableName = (item: T) => item.name || item.title || '';
            const getSortableDate = (item: T) => item.createdAt || item.favoritedAt || '';

            if (sortBy === 'name') {
                return getSortableName(a).localeCompare(getSortableName(b));
            } else {
                return new Date(getSortableDate(b)).getTime() - new Date(getSortableDate(a)).getTime();
            }
        });
    };

    const filterItems = <T extends { id: number; name?: string; title?: string }>(items: T[]): T[] => {
        if (!searchFilter) return items;
        return items.filter(item => {
            const name = item.name || item.title || '';
            return name.toLowerCase().includes(searchFilter.toLowerCase());
        });
    };

    const handleRemoveFavorite = async (trackId: number) => {
        try {
            await favoritesAPI.remove(trackId);
            setLikedSongs(prev => prev.filter(t => t.id !== trackId));
        } catch (error) {
            console.error('Failed to remove favorite:', error);
        }
    };

    const renderContent = () => {
        if (loading) {
            return <div className="text-center py-8 text-zinc-400">Loading...</div>;
        }

        switch (activeTab) {
            case 'playlists': {
                const filteredPlaylists = filterItems<Playlist>(sortItems<Playlist>(playlists));
                return (
                    <div>
                        {filteredPlaylists.length === 0 ? (
                            <p className="text-zinc-400">No playlists found.</p>
                        ) : (
                            <div className={viewType === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4' : 'space-y-2'}>
                                {filteredPlaylists.map(playlist => (
                                    <div
                                        key={playlist.id}
                                        className={`bg-zinc-800/50 hover:bg-zinc-800 transition-colors cursor-pointer ${viewType === 'grid' ? 'p-4 rounded-lg' : 'p-3 rounded flex items-center justify-between'
                                            }`}
                                    >
                                        <div>
                                            <div className="font-medium text-sm">{playlist.name}</div>
                                            <div className="text-xs text-zinc-400">
                                                {playlist._count?.tracks || 0} tracks
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            }
            case 'albums': {
                const filteredAlbums = filterItems<Album>(sortItems<Album>(albums));
                return (
                    <div>
                        {filteredAlbums.length === 0 ? (
                            <p className="text-zinc-400">No albums found.</p>
                        ) : (
                            <div className={viewType === 'grid' ? 'grid grid-cols-2 md:grid-cols-4 gap-4' : 'space-y-2'}>
                                {filteredAlbums.map(album => (
                                    <div
                                        key={album.id}
                                        className={`bg-zinc-800/50 hover:bg-zinc-800 transition-colors cursor-pointer ${viewType === 'grid' ? 'p-4 rounded-lg' : 'p-3 rounded flex items-center justify-between'
                                            }`}
                                    >
                                        <div>
                                            <div className="font-medium text-sm">{album.title}</div>
                                            <div className="text-xs text-zinc-400">
                                                {album.artistName} - {album.trackCount} tracks
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            }
            case 'liked': {
                const filteredSongs = filterItems<LikedTrack>(sortItems<LikedTrack>(likedSongs));
                return (
                    <div>
                        {filteredSongs.length === 0 ? (
                            <p className="text-zinc-400">No liked songs yet.</p>
                        ) : (
                            <div className="space-y-1">
                                {filteredSongs.map((song, idx) => (
                                    <div
                                        key={song.id}
                                        className="p-3 hover:bg-zinc-800/50 rounded flex items-center gap-4 cursor-pointer group"
                                    >
                                        <span className="text-zinc-500 text-sm w-6">{idx + 1}</span>
                                        <div className="flex-1">
                                            <div className="font-medium text-sm group-hover:text-green-400">{song.title}</div>
                                            <div className="text-xs text-zinc-400">{song.artistName}</div>
                                        </div>
                                        <span className="text-xs text-zinc-500">{formatDuration(song.duration)}</span>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleRemoveFavorite(song.id);
                                            }}
                                            className="text-xs text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            }
        }
    };

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Your Library</h1>
                <div className="flex items-center gap-4">
                    <input
                        type="text"
                        placeholder="Filter..."
                        value={searchFilter}
                        onChange={(e) => setSearchFilter(e.target.value)}
                        className="bg-zinc-800 border border-zinc-700 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-green-500 w-40"
                    />
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as SortType)}
                        className="bg-zinc-800 border border-zinc-700 rounded px-3 py-1.5 text-sm focus:outline-none"
                    >
                        <option value="recent">Recent</option>
                        <option value="name">Name</option>
                    </select>
                    <div className="flex border border-zinc-700 rounded overflow-hidden">
                        <button
                            onClick={() => setViewType('grid')}
                            className={`px-3 py-1.5 text-xs ${viewType === 'grid' ? 'bg-zinc-700' : 'bg-zinc-800 hover:bg-zinc-700'}`}
                        >
                            Grid
                        </button>
                        <button
                            onClick={() => setViewType('list')}
                            className={`px-3 py-1.5 text-xs ${viewType === 'list' ? 'bg-zinc-700' : 'bg-zinc-800 hover:bg-zinc-700'}`}
                        >
                            List
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex gap-2 mb-6 border-b border-zinc-800 pb-4">
                {tabs.map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === tab.key
                            ? 'bg-white text-black'
                            : 'bg-zinc-800 text-white hover:bg-zinc-700'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {renderContent()}

            {pagination.totalPages > 1 && (
                <div className="flex gap-2 mt-6 justify-center">
                    {Array.from({ length: pagination.totalPages }, (_, i) => (
                        <button
                            key={i + 1}
                            onClick={() => loadData(i + 1)}
                            className={`px-3 py-1 rounded text-sm ${pagination.page === i + 1 ? 'bg-white text-black' : 'bg-zinc-800 hover:bg-zinc-700'}`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LibraryPage;
