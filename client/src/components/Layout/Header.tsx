import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useState } from 'react';
import NotificationsDropdown from '../NotificationsDropdown';

const Header = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    return (
        <header className="h-14 bg-zinc-900/80 backdrop-blur-sm sticky top-0 z-10 px-6 flex items-center justify-between border-b border-zinc-800">
            <div className="flex items-center gap-3">
                <button
                    onClick={() => navigate(-1)}
                    className="text-zinc-400 hover:text-white text-sm font-medium px-3 py-1.5 rounded hover:bg-zinc-800 transition-colors"
                >
                    Back
                </button>
                <button
                    onClick={() => navigate(1)}
                    className="text-zinc-400 hover:text-white text-sm font-medium px-3 py-1.5 rounded hover:bg-zinc-800 transition-colors"
                >
                    Forward
                </button>
            </div>

            <div className="flex items-center gap-4">
                <NotificationsDropdown />

                <div className="relative">
                    <button
                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                        className="bg-zinc-800 hover:bg-zinc-700 rounded-full px-4 py-2 flex items-center gap-2 transition-all text-sm"
                    >
                        <span className="font-medium text-white">{user?.username || 'Guest'}</span>
                        <span className="text-zinc-400">Menu</span>
                    </button>

                    {showProfileMenu && (
                        <div className="absolute right-0 top-12 w-44 bg-zinc-800 rounded-md shadow-xl border border-zinc-700 py-1 overflow-hidden z-20">
                            <button className="w-full text-left px-4 py-2.5 text-sm text-white hover:bg-zinc-700">
                                Profile
                            </button>
                            <button className="w-full text-left px-4 py-2.5 text-sm text-white hover:bg-zinc-700">
                                Settings
                            </button>
                            <div className="h-px bg-zinc-700 my-1" />
                            <button
                                onClick={() => {
                                    logout();
                                    setShowProfileMenu(false);
                                }}
                                className="w-full text-left px-4 py-2.5 text-sm text-white hover:bg-zinc-700"
                            >
                                Log out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
