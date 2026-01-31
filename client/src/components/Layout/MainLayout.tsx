import { useRef } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import MusicPlayer from '../Player/MusicPlayer';

const MainLayout = () => {
    // We can use a ref for the scrollable container if needed for scroll-based header opacity
    const mainContentRef = useRef<HTMLDivElement>(null);

    return (
        <div className="flex h-screen bg-black text-white p-2 gap-2 overflow-hidden font-sans">
            <Sidebar />

            <div className="flex-1 flex flex-col bg-[#121212] rounded-lg overflow-hidden relative">
                <Header />
                <main
                    ref={mainContentRef}
                    className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-[#282828] scrollbar-track-transparent pb-28"
                >
                    <Outlet />
                </main>
            </div>

            <MusicPlayer />
        </div>
    );
};

export default MainLayout;
