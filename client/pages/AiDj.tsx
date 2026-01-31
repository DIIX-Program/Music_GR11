import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Sparkles, Send, Music } from 'lucide-react';
import { MOCK_TRACKS } from '../constants';
import { Track } from '../types';
import { usePlayer } from '../context/PlayerContext';

const AiDj: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [suggestedTracks, setSuggestedTracks] = useState<Track[]>([]);
  const { play } = usePlayer();

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    setResponseMessage(null);
    setSuggestedTracks([]);

    try {
      const apiKey = process.env.API_KEY;
      
      if (!apiKey) {
        // Fallback simulation if no API key is present in this specific build environment
        await new Promise(resolve => setTimeout(resolve, 1500));
        setResponseMessage("I found some tracks that match your vibe based on our local database.");
        setSuggestedTracks([MOCK_TRACKS[0], MOCK_TRACKS[3], MOCK_TRACKS[2]]);
        setLoading(false);
        return;
      }

      const ai = new GoogleGenAI({ apiKey });
      const systemInstruction = `
        You are an expert AI Music DJ. 
        Based on the user's mood or request, suggest a list of 3 songs from the following available catalog.
        
        Catalog:
        ${JSON.stringify(MOCK_TRACKS.map(t => ({ id: t.id, title: t.title, artist: t.artist, genre: t.genre })))}

        Return ONLY a JSON array of the track IDs that match the mood. 
        Example: ["1", "4", "2"]
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          systemInstruction: systemInstruction,
          responseMimeType: "application/json"
        }
      });

      const text = response.text;
      if (text) {
        const trackIds = JSON.parse(text);
        const tracks = MOCK_TRACKS.filter(t => trackIds.includes(t.id));
        setSuggestedTracks(tracks);
        setResponseMessage(`Here's a mix I made for: "${prompt}"`);
      }

    } catch (error) {
      console.error("AI Error:", error);
      setResponseMessage("I had trouble connecting to the AI DJ. Here is a random selection instead.");
      setSuggestedTracks([MOCK_TRACKS[1], MOCK_TRACKS[4]]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 pb-32 bg-gradient-to-b from-indigo-900/40 to-neutral-900 min-h-full flex flex-col items-center">
      <div className="max-w-2xl w-full text-center mb-12">
        <div className="inline-flex items-center justify-center p-4 bg-indigo-600 rounded-full mb-6 shadow-xl shadow-indigo-900/50">
          <Sparkles size={48} className="text-white" />
        </div>
        <h1 className="text-4xl font-bold mb-4">AI DJ</h1>
        <p className="text-neutral-400 text-lg">
          Describe your mood, activity, or genre, and let our AI curate the perfect vibe for you.
        </p>
      </div>

      <div className="max-w-xl w-full relative mb-12">
        <input 
          type="text" 
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., 'Late night coding session with synthwave'"
          className="w-full bg-neutral-800 border border-neutral-700 rounded-full py-4 pl-6 pr-14 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition shadow-lg"
          onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
        />
        <button 
          onClick={handleGenerate}
          disabled={loading || !prompt}
          className="absolute right-2 top-2 p-2 bg-indigo-600 rounded-full hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Send size={20} />
          )}
        </button>
      </div>

      {responseMessage && (
        <div className="max-w-2xl w-full animate-fade-in">
          <h3 className="text-xl font-semibold mb-6 text-indigo-200">{responseMessage}</h3>
          
          <div className="space-y-2">
            {suggestedTracks.map((track) => (
              <div 
                key={track.id}
                onClick={() => play(track)}
                className="flex items-center gap-4 p-3 bg-white/5 hover:bg-white/10 rounded-lg cursor-pointer transition group"
              >
                <img src={track.coverUrl} alt={track.title} className="w-12 h-12 rounded object-cover" />
                <div className="flex-1">
                  <h4 className="font-semibold group-hover:text-indigo-400 transition">{track.title}</h4>
                  <p className="text-sm text-neutral-400">{track.artist}</p>
                </div>
                <div className="p-2 bg-indigo-600 rounded-full opacity-0 group-hover:opacity-100 transition transform scale-90 group-hover:scale-100">
                  <Music size={16} fill="white" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AiDj;
