import React from 'react';
import { Home, Search, Library, PlusSquare, Heart, Sparkles, LogOut } from 'lucide-react';
import { ViewState } from '../types';

interface SidebarProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView }) => {
  const NavItem = ({ view, icon: Icon, label }: { view: ViewState, icon: any, label: string }) => (
    <button 
      onClick={() => onChangeView(view)}
      className={`flex items-center gap-4 px-4 py-3 w-full transition font-semibold text-sm ${
        currentView === view ? 'text-white' : 'text-neutral-400 hover:text-white'
      }`}
    >
      <Icon size={24} />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="w-64 bg-black h-full flex flex-col gap-2 p-2 hidden md:flex">
      {/* Main Nav */}
      <div className="bg-neutral-900 rounded-lg p-4 flex flex-col">
        <NavItem view="HOME" icon={Home} label="Home" />
        <NavItem view="SEARCH" icon={Search} label="Search" />
        <NavItem view="LIBRARY" icon={Library} label="Your Library" />
      </div>

      {/* AI & Playlists */}
      <div className="bg-neutral-900 rounded-lg p-4 flex-1 flex flex-col overflow-hidden">
        <div className="mb-4">
          <NavItem view="AI_DJ" icon={Sparkles} label="AI DJ" />
        </div>
        
        <div className="mt-2 space-y-4">
          <button className="flex items-center gap-4 px-4 text-neutral-400 hover:text-white transition text-sm font-semibold">
            <PlusSquare size={24} />
            <span>Create Playlist</span>
          </button>
          <button className="flex items-center gap-4 px-4 text-neutral-400 hover:text-white transition text-sm font-semibold">
            <Heart size={24} className="bg-gradient-to-br from-indigo-500 to-blue-300 rounded-sm p-1 text-white" />
            <span>Liked Songs</span>
          </button>
        </div>

        <div className="border-t border-neutral-800 mt-4 pt-4 flex-1 overflow-y-auto custom-scrollbar">
           <div className="space-y-2">
             <p className="px-4 text-sm text-neutral-400 hover:text-white cursor-pointer">Chill Vibes</p>
             <p className="px-4 text-sm text-neutral-400 hover:text-white cursor-pointer">Gym Playlist</p>
             <p className="px-4 text-sm text-neutral-400 hover:text-white cursor-pointer">Top 50 - Global</p>
             <p className="px-4 text-sm text-neutral-400 hover:text-white cursor-pointer">Indie Mix</p>
           </div>
        </div>

        <div className="mt-auto pt-4 border-t border-neutral-800">
             <button className="flex items-center gap-2 px-4 text-neutral-400 hover:text-white text-sm">
                <LogOut size={16} />
                Logout
             </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
