export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  coverUrl: string;
  duration: number; // in seconds
  audioUrl?: string; // Optional for mock purposes
  genre: string;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  coverUrl: string;
  tracks: Track[];
}

export type ViewState = 'HOME' | 'SEARCH' | 'LIBRARY' | 'AI_DJ';

export interface PlayerContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number;
  progress: number;
  play: (track: Track) => void;
  pause: () => void;
  resume: () => void;
  next: () => void;
  prev: () => void;
  seek: (time: number) => void;
  setVolume: (vol: number) => void;
  queue: Track[];
  addToQueue: (track: Track) => void;
}
