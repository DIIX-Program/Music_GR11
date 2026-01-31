import { Track, Playlist } from './types';

export const MOCK_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Midnight City',
    artist: 'M83',
    album: 'Hurry Up, We\'re Dreaming',
    coverUrl: 'https://picsum.photos/id/10/300/300',
    duration: 243,
    genre: 'Electronic',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
  },
  {
    id: '2',
    title: 'Starboy',
    artist: 'The Weeknd',
    album: 'Starboy',
    coverUrl: 'https://picsum.photos/id/20/300/300',
    duration: 230,
    genre: 'R&B',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
  },
  {
    id: '3',
    title: 'Neon Lights',
    artist: 'Synthwave Boy',
    album: 'Retro Future',
    coverUrl: 'https://picsum.photos/id/30/300/300',
    duration: 185,
    genre: 'Synthwave',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
  },
  {
    id: '4',
    title: 'Deep Focus',
    artist: 'Ambient Minds',
    album: 'Study Session',
    coverUrl: 'https://picsum.photos/id/40/300/300',
    duration: 300,
    genre: 'Ambient',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3'
  },
  {
    id: '5',
    title: 'Rock Anthem',
    artist: 'The Guitars',
    album: 'Heavy Hits',
    coverUrl: 'https://picsum.photos/id/50/300/300',
    duration: 210,
    genre: 'Rock',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3'
  }
];

export const MOCK_PLAYLISTS: Playlist[] = [
  {
    id: 'p1',
    name: 'Top Hits 2024',
    description: 'The hottest tracks right now.',
    coverUrl: 'https://picsum.photos/id/100/300/300',
    tracks: [MOCK_TRACKS[0], MOCK_TRACKS[1]]
  },
  {
    id: 'p2',
    name: 'Coding Focus',
    description: 'Zero distractions.',
    coverUrl: 'https://picsum.photos/id/101/300/300',
    tracks: [MOCK_TRACKS[3], MOCK_TRACKS[2]]
  },
  {
    id: 'p3',
    name: 'Workout Pump',
    description: 'Get those gains.',
    coverUrl: 'https://picsum.photos/id/102/300/300',
    tracks: [MOCK_TRACKS[4], MOCK_TRACKS[0]]
  }
];

export const GREETINGS = [
  "Good morning",
  "Good afternoon",
  "Good evening"
];
