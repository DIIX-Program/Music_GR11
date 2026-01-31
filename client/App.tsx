import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Player from './components/Player';
import Home from './pages/Home';
import Search from './pages/Search';
import Library from './pages/Library';
import AiDj from './pages/AiDj';
import { ViewState } from './types';
import { User } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('HOME');

  const renderView = () => {
    switch (currentView) {
      case 'HOME': return <Home />;
      case 'SEARCH': return <Search />;
      case 'LIBRARY': return <Library />;
      case 'AI_DJ': return <AiDj />;
      default: return <Home />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-black text-white overflow-hidden font-sans">
      <div className="flex-1 flex overflow-hidden">
        <Sidebar currentView={currentView} onChangeView={setCurrentView} />
        
        <main className="flex-1 relative flex flex-col bg-neutral-900 rounded-lg my-2 mr-2 overflow-hidden">
          {/* Top Bar (Transparent/Sticky) */}
          <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black/50 to-transparent z-10 px-6 flex items-center justify-between pointer-events-none">
            {/* Navigation Arrows (Visual only for this mock) */}
            <div className="flex gap-2 pointer-events-auto">
               <div className="w-8 h-8 rounded-full bg-black/50 flex items-center justify-center cursor-pointer hover:bg-black/70 text-neutral-400">
                 &lt;
               </div>
               <div className="w-8 h-8 rounded-full bg-black/50 flex items-center justify-center cursor-pointer hover:bg-black/70 text-neutral-400">
                 &gt;
               </div>
            </div>

            <div className="pointer-events-auto">
               <button className="bg-black/50 hover:bg-neutral-800 rounded-full p-1 pr-4 flex items-center gap-2 transition">
                  <div className="w-7 h-7 bg-neutral-700 rounded-full flex items-center justify-center">
                    <User size={16} />
                  </div>
                  <span className="text-sm font-semibold">User</span>
               </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {renderView()}
          </div>
        </main>
      </div>

      <Player />
    </div>
  );
};

export default App;
