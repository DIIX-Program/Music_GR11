import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
    const location = useLocation();

    const menuItems = [
        { label: 'Home', path: '/app' },
        { label: 'Search', path: '/app/search' },
        { label: 'Library', path: '/app/library' },
    ];

    return (
        <aside className="w-56 bg-black h-full flex flex-col gap-2 p-2">
            <div className="bg-zinc-900 rounded-lg p-5 flex flex-col gap-5">
                <Link to="/app" className="px-2">
                    <span className="text-xl font-bold text-white tracking-tight">StreamFlow</span>
                </Link>

                <nav className="flex flex-col gap-1">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`px-4 py-2.5 rounded-md transition-colors text-sm font-medium ${location.pathname === item.path || (item.path !== '/app' && location.pathname.startsWith(item.path))
                                ? 'bg-zinc-800 text-white'
                                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                                }`}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </div>

            <div className="bg-zinc-900 rounded-lg flex-1 p-4 overflow-y-auto">
                <div className="space-y-3">
                    <button className="text-zinc-400 hover:text-white transition-colors w-full text-left text-sm font-medium py-2">
                        + Create Playlist
                    </button>
                    <button className="text-zinc-400 hover:text-white transition-colors w-full text-left text-sm font-medium py-2">
                        Liked Songs
                    </button>
                </div>

                <div className="mt-4 border-t border-zinc-800 pt-4 space-y-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="text-xs text-zinc-500 hover:text-white cursor-pointer truncate py-1">
                            My Playlist #{i}
                        </div>
                    ))}
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
