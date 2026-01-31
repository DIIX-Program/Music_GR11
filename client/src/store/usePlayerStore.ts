import { create } from 'zustand';

interface Track {
    id: number;
    title: string;
    artist: string;
    file_path?: string;
    cover_image?: string;
    duration: number;
}

interface PlayerState {
    currentTrack: Track | null;
    isPlaying: boolean;
    queue: Track[];
    recentlyPlayed: Track[];
    volume: number;
    currentTime: number;

    // Actions
    playTrack: (track: Track) => void;
    pauseTrack: () => void;
    resumeTrack: () => void;
    togglePlay: () => void;
    addToQueue: (track: Track) => void;
    nextTrack: () => void;
    prevTrack: () => void;
    setVolume: (vol: number) => void;
    setCurrentTime: (time: number) => void;
    clearQueue: () => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
    currentTrack: null,
    isPlaying: false,
    queue: [],
    recentlyPlayed: [],
    volume: 1,
    currentTime: 0,

    playTrack: (track) => {
        const { recentlyPlayed } = get();
        // Add current to recently played if it exists
        const updated = [track, ...recentlyPlayed.filter(t => t.id !== track.id)].slice(0, 20);
        set({ currentTrack: track, isPlaying: true, recentlyPlayed: updated, currentTime: 0 });
    },

    pauseTrack: () => set({ isPlaying: false }),
    resumeTrack: () => set({ isPlaying: true }),
    togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),

    addToQueue: (track) => set((state) => ({ queue: [...state.queue, track] })),
    clearQueue: () => set({ queue: [] }),

    nextTrack: () => {
        const { queue, currentTrack, recentlyPlayed } = get();
        if (queue.length > 0) {
            const next = queue[0];
            const newQueue = queue.slice(1);
            const updated = currentTrack
                ? [currentTrack, ...recentlyPlayed.filter(t => t.id !== currentTrack.id)].slice(0, 20)
                : recentlyPlayed;
            set({ currentTrack: next, queue: newQueue, recentlyPlayed: updated, currentTime: 0 });
        }
    },

    prevTrack: () => {
        const { recentlyPlayed, currentTrack } = get();
        if (recentlyPlayed.length > 0) {
            const prev = recentlyPlayed[0];
            const updated = recentlyPlayed.slice(1);
            set({ currentTrack: prev, recentlyPlayed: updated, currentTime: 0 });
        }
    },

    setVolume: (volume) => set({ volume }),
    setCurrentTime: (currentTime) => set({ currentTime }),
}));
