import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchAPI } from '../services/api';

interface SearchResult {
    id: number;
    title?: string;
    username?: string; // for artist
    name?: string; // for album/playlist
    artistName?: string;
    coverImage: string | null;
    type: 'track' | 'artist' | 'album' | 'playlist';
    description?: string;
}

const SearchPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const [inputValue, setInputValue] = useState(query);
    const [activeFilter, setActiveFilter] = useState<'all' | 'track' | 'artist' | 'album' | 'playlist'>('all');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);

    // Debounce search
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (inputValue.trim()) {
                setSearchParams({ q: inputValue });
                performSearch(inputValue, activeFilter === 'all' ? undefined : activeFilter);
            } else {
                setResults([]);
            }
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [inputValue, activeFilter]);

    const performSearch = async (q: string, type?: string) => {
        if (!q.trim()) return;
        setLoading(true);
        try {
            const res = await searchAPI.search(q, { type });
            setResults(res.data.data || []);
        } catch (error) {
            console.error('Search failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const filters = [
        { key: 'all', label: 'All' },
        { key: 'track', label: 'Songs' },
        { key: 'artist', label: 'Artists' },
        { key: 'album', label: 'Albums' },
        { key: 'playlist', label: 'Playlists' },
    ] as const;

    const renderCard = (item: SearchResult) => {
        const title = item.title || item.username || item.name;
        const subTitle = item.artistName || item.type;

        return (
            <div
                key={`${item.type}-${item.id}`}
                className="bg-zinc-800/40 p-4 rounded-md hover:bg-zinc-800 transition-colors cursor-pointer group"
            >
                <div className={`mb-4 shadow-lg ${item.type === 'artist' ? 'rounded-full aspect-square' : 'rounded-md aspect-square'} bg-zinc-700 overflow-hidden relative`}>
                    {item.coverImage ? (
                        <img src={item.coverImage} alt={title} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-sm bg-gradient-to-br from-zinc-700 to-zinc-600 text-white font-medium">
                            {item.type === 'artist' ? 'Artist' : 'Music'}
                        </div>
                    )}
                </div>
                <h3 className="font-bold truncate text-white mb-1">{title}</h3>
                <p className="text-sm text-zinc-400 capitalize">{subTitle}</p>
            </div>
        );
    };

    return (
        <div className="p-6">
            {/* Search Input */}
            <div className="mb-6 sticky top-0 z-10 bg-[#121212] py-4 -mt-6">
                <input
                    type="text"
                    placeholder="What do you want to listen to?"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="w-full max-w-md bg-zinc-800 border border-zinc-700 rounded-full px-5 py-3 text-sm focus:outline-none focus:border-green-500 transition-colors text-white"
                />
            </div>

            {/* Filters */}
            <div className="flex gap-2 mb-8">
                {filters.map(filter => (
                    <button
                        key={filter.key}
                        onClick={() => setActiveFilter(filter.key)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeFilter === filter.key
                            ? 'bg-white text-black'
                            : 'bg-zinc-800 text-white hover:bg-zinc-700'
                            }`}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>

            {/* Results */}
            {loading ? (
                <div className="text-center text-zinc-500 py-10">Searching...</div>
            ) : !inputValue ? (
                <div className="text-center text-zinc-500 py-20">
                    <p className="text-lg mb-2">Search for songs, artists, albums...</p>
                </div>
            ) : results.length === 0 ? (
                <div className="text-center text-zinc-500 py-10">
                    <p>No results found for "{inputValue}"</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {results.map(renderCard)}
                </div>
            )}
        </div>
    );
};

export default SearchPage;
