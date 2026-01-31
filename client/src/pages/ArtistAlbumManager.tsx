import React, { useState, useEffect } from 'react';
import { artistAPI, albumsAPI } from '../services/api';

interface Album {
    id: number;
    title: string;
    coverImage: string | null;
    releaseDate: string;
    _count: { tracks: number };
}

interface Track {
    id: number;
    title: string;
    albumId: number | null;
}

const ArtistAlbumManager = () => {
    const [albums, setAlbums] = useState<Album[]>([]);
    const [tracks, setTracks] = useState<Track[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newAlbumData, setNewAlbumData] = useState({ title: '', coverImage: '' });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [albumsRes, tracksRes] = await Promise.all([
                albumsAPI.getMyAlbums(),
                artistAPI.getMyTracks()
            ]);
            setAlbums(albumsRes.data.data);
            setTracks(tracksRes.data.data);
        } catch (error) {
            console.error('Failed to load data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateAlbum = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await albumsAPI.create(newAlbumData);
            setIsCreateModalOpen(false);
            setNewAlbumData({ title: '', coverImage: '' });
            loadData();
        } catch (error) {
            console.error('Failed to create album:', error);
        }
    };

    const handleDeleteAlbum = async (id: number) => {
        if (!confirm('Are you sure? Tracks will be unlinked but not deleted.')) return;
        try {
            await albumsAPI.delete(id);
            if (selectedAlbum?.id === id) setSelectedAlbum(null);
            loadData();
        } catch (error) {
            console.error('Failed to delete album:', error);
        }
    };

    const handleAddTrackToAlbum = async (albumId: number, trackId: number) => {
        try {
            await albumsAPI.addTrack(albumId, trackId);
            loadData(); // Refresh to show updated counts/assignment
        } catch (error) {
            console.error('Failed to add track to album:', error);
        }
    };

    const handleRemoveTrackFromAlbum = async (albumId: number, trackId: number) => {
        try {
            await albumsAPI.removeTrack(albumId, trackId);
            loadData();
        } catch (error) {
            console.error('Failed to remove track from album:', error);
        }
    };

    const getUnassignedTracks = () => tracks.filter(t => !t.albumId);
    const getAlbumTracks = (albumId: number) => tracks.filter(t => t.albumId === albumId);

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Album Management</h1>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-green-500 text-black px-4 py-2 rounded font-medium hover:bg-green-400"
                >
                    + Create Album
                </button>
            </div>

            <div className="grid md:grid-cols-[1fr_2fr] gap-6">
                {/* Album List */}
                <div className="bg-zinc-800/50 p-4 rounded-lg h-[calc(100vh-200px)] overflow-y-auto">
                    <h2 className="font-bold mb-4">Your Albums</h2>
                    <div className="space-y-2">
                        {albums.length === 0 ? (
                            <p className="text-zinc-400 text-sm">No albums created yet.</p>
                        ) : (
                            albums.map(album => (
                                <div
                                    key={album.id}
                                    onClick={() => setSelectedAlbum(album)}
                                    className={`p-3 rounded cursor-pointer transition-colors ${selectedAlbum?.id === album.id ? 'bg-zinc-700' : 'bg-zinc-800 hover:bg-zinc-700'
                                        }`}
                                >
                                    <div className="font-medium">{album.title}</div>
                                    <div className="text-xs text-zinc-400">
                                        {new Date(album.releaseDate).getFullYear()} • {album._count?.tracks || 0} tracks
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteAlbum(album.id);
                                        }}
                                        className="text-red-400 text-xs mt-2 hover:text-red-300"
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Album Details / Track Assignment */}
                <div className="bg-zinc-800/50 p-4 rounded-lg h-[calc(100vh-200px)] overflow-y-auto">
                    {selectedAlbum ? (
                        <>
                            <h2 className="font-bold mb-4">Managing: {selectedAlbum.title}</h2>

                            <div className="mb-6">
                                <h3 className="text-sm font-medium text-zinc-400 mb-2">Tracks in Album</h3>
                                <div className="space-y-1">
                                    {getAlbumTracks(selectedAlbum.id).length === 0 ? (
                                        <p className="text-zinc-500 text-sm">No tracks in this album</p>
                                    ) : (
                                        getAlbumTracks(selectedAlbum.id).map(track => (
                                            <div key={track.id} className="flex justify-between items-center p-2 bg-zinc-900/50 rounded">
                                                <span>{track.title}</span>
                                                <button
                                                    onClick={() => handleRemoveTrackFromAlbum(selectedAlbum.id, track.id)}
                                                    className="text-red-400 text-xs hover:text-red-300"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-zinc-400 mb-2">Unassigned Tracks</h3>
                                <div className="space-y-1">
                                    {getUnassignedTracks().length === 0 ? (
                                        <p className="text-zinc-500 text-sm">No unassigned tracks available</p>
                                    ) : (
                                        getUnassignedTracks().map(track => (
                                            <div key={track.id} className="flex justify-between items-center p-2 bg-zinc-900/50 rounded">
                                                <span>{track.title}</span>
                                                <button
                                                    onClick={() => handleAddTrackToAlbum(selectedAlbum.id, track.id)}
                                                    className="text-green-400 text-xs hover:text-green-300"
                                                >
                                                    Add to Album
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="h-full flex items-center justify-center text-zinc-500">
                            Select an album to manage tracks
                        </div>
                    )}
                </div>
            </div>

            {/* Create Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-zinc-800 p-6 rounded-lg w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Create New Album</h2>
                        <form onSubmit={handleCreateAlbum}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Title</label>
                                <input
                                    type="text"
                                    required
                                    value={newAlbumData.title}
                                    onChange={e => setNewAlbumData({ ...newAlbumData, title: e.target.value })}
                                    className="w-full bg-zinc-700 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                                />
                            </div>
                            <div className="mb-6">
                                <label className="block text-sm font-medium mb-1">Cover Image URL (optional)</label>
                                <input
                                    type="text"
                                    value={newAlbumData.coverImage}
                                    onChange={e => setNewAlbumData({ ...newAlbumData, coverImage: e.target.value })}
                                    className="w-full bg-zinc-700 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                                />
                            </div>
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="text-zinc-400 hover:text-white"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-green-500 text-black px-4 py-2 rounded font-medium hover:bg-green-400"
                                >
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ArtistAlbumManager;
