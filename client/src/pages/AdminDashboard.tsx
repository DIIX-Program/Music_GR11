import { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';

type AdminTab = 'users' | 'artists' | 'stats';

interface User {
    id: number;
    username: string;
    email: string;
    role: string;
    isActive: boolean;
    createdAt: string;
}

interface VerificationRequest {
    id: number;
    status: string;
    submittedAt: string;
    artist: {
        id: number;
        user: {
            id: number;
            username: string;
            email: string;
        };
    };
}

interface Stats {
    users: number;
    artists: number;
    tracks: number;
    playlists: number;
    listens: number;
}

interface DailyPlay {
    date: string;
    count: number;
}

interface TopTrack {
    id: number;
    title: string;
    artistName: string;
    plays: number;
}

interface TopArtist {
    id: number;
    username: string;
    totalPlays: number;
    trackCount: number;
    verified: boolean;
}

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState<AdminTab>('stats');
    const [loading, setLoading] = useState(false);

    // Data states
    const [users, setUsers] = useState<User[]>([]);
    const [usersPagination, setUsersPagination] = useState({ page: 1, totalPages: 1 });
    const [verificationRequests, setVerificationRequests] = useState<VerificationRequest[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [dailyPlays, setDailyPlays] = useState<DailyPlay[]>([]);
    const [topTracks, setTopTracks] = useState<TopTrack[]>([]);
    const [topArtists, setTopArtists] = useState<TopArtist[]>([]);
    const [newUsersCount, setNewUsersCount] = useState(0);

    const tabs = [
        { key: 'stats', label: 'System Stats' },
        { key: 'users', label: 'Users' },
        { key: 'artists', label: 'Artist Verification' },
    ] as const;

    useEffect(() => {
        if (activeTab === 'stats') {
            loadStats();
        } else if (activeTab === 'users') {
            loadUsers();
        } else if (activeTab === 'artists') {
            loadVerificationRequests();
        }
    }, [activeTab]);

    const loadStats = async () => {
        setLoading(true);
        try {
            const [statsRes, dailyRes, topTracksRes, topArtistsRes, newUsersRes] = await Promise.all([
                adminAPI.getStats(),
                adminAPI.getDailyPlays(7),
                adminAPI.getTopTracks(5),
                adminAPI.getTopArtists(5),
                adminAPI.getNewUsers(7),
            ]);
            setStats(statsRes.data.data);
            setDailyPlays(dailyRes.data.data || []);
            setTopTracks(topTracksRes.data.data || []);
            setTopArtists(topArtistsRes.data.data || []);
            setNewUsersCount(newUsersRes.data.data?.count || 0);
        } catch (error) {
            console.error('Failed to load stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadUsers = async (page = 1) => {
        setLoading(true);
        try {
            const res = await adminAPI.getUsers({ page, limit: 20 });
            setUsers(res.data.data.users);
            setUsersPagination({ page: res.data.data.page, totalPages: res.data.data.totalPages });
        } catch (error) {
            console.error('Failed to load users:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadVerificationRequests = async () => {
        setLoading(true);
        try {
            const res = await adminAPI.getVerificationRequests({ status: 'PENDING' });
            setVerificationRequests(res.data.data.requests);
        } catch (error) {
            console.error('Failed to load verification requests:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBlockUser = async (userId: number, currentlyActive: boolean) => {
        try {
            await adminAPI.toggleUserBlock(userId, currentlyActive);
            loadUsers(usersPagination.page);
        } catch (error) {
            console.error('Failed to toggle user block:', error);
        }
    };

    const handleApproveVerification = async (requestId: number) => {
        try {
            await adminAPI.approveVerification(requestId);
            loadVerificationRequests();
        } catch (error) {
            console.error('Failed to approve verification:', error);
        }
    };

    const handleRejectVerification = async (requestId: number) => {
        const notes = prompt('Reason for rejection (optional):');
        try {
            await adminAPI.rejectVerification(requestId, notes || undefined);
            loadVerificationRequests();
        } catch (error) {
            console.error('Failed to reject verification:', error);
        }
    };

    const renderContent = () => {
        if (loading) {
            return <div className="text-center py-8 text-zinc-400">Loading...</div>;
        }

        switch (activeTab) {
            case 'users':
                return (
                    <div>
                        <h2 className="text-lg font-bold mb-4">Manage Users</h2>
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-zinc-400 text-sm border-b border-zinc-800">
                                    <th className="pb-3">Username</th>
                                    <th className="pb-3">Email</th>
                                    <th className="pb-3">Role</th>
                                    <th className="pb-3">Status</th>
                                    <th className="pb-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                                        <td className="py-4 text-sm">{user.username}</td>
                                        <td className="py-4 text-sm text-zinc-400">{user.email}</td>
                                        <td className="py-4 text-sm">
                                            <span className={`text-xs px-2 py-1 rounded ${user.role === 'ARTIST' ? 'bg-purple-500/20 text-purple-400' :
                                                user.role === 'ADMIN' ? 'bg-red-500/20 text-red-400' :
                                                    'bg-zinc-700 text-zinc-300'
                                                }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="py-4">
                                            <span className={`text-xs px-2 py-1 rounded ${user.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                                                }`}>
                                                {user.isActive ? 'Active' : 'Blocked'}
                                            </span>
                                        </td>
                                        <td className="py-4">
                                            <button
                                                onClick={() => handleBlockUser(user.id, user.isActive)}
                                                className={`text-sm ${user.isActive ? 'text-red-400 hover:text-red-300' : 'text-green-400 hover:text-green-300'}`}
                                            >
                                                {user.isActive ? 'Block' : 'Unblock'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {usersPagination.totalPages > 1 && (
                            <div className="flex gap-2 mt-4 justify-center">
                                {Array.from({ length: usersPagination.totalPages }, (_, i) => (
                                    <button
                                        key={i + 1}
                                        onClick={() => loadUsers(i + 1)}
                                        className={`px-3 py-1 rounded text-sm ${usersPagination.page === i + 1 ? 'bg-white text-black' : 'bg-zinc-800 hover:bg-zinc-700'}`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                );
            case 'artists':
                return (
                    <div>
                        <h2 className="text-lg font-bold mb-4">Artist Verification Requests</h2>
                        {verificationRequests.length === 0 ? (
                            <p className="text-zinc-400">No pending verification requests</p>
                        ) : (
                            <div className="space-y-3">
                                {verificationRequests.map(request => (
                                    <div key={request.id} className="bg-zinc-800/50 p-4 rounded-lg flex items-center justify-between">
                                        <div>
                                            <div className="font-medium">{request.artist.user.username}</div>
                                            <div className="text-sm text-zinc-400">
                                                {request.artist.user.email} - Applied: {new Date(request.submittedAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleApproveVerification(request.id)}
                                                className="bg-green-500 text-black px-4 py-2 rounded text-sm font-medium hover:bg-green-400"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => handleRejectVerification(request.id)}
                                                className="bg-red-500/20 text-red-400 px-4 py-2 rounded text-sm font-medium hover:bg-red-500/30"
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            case 'stats':
                return (
                    <div className="space-y-6">
                        <h2 className="text-lg font-bold mb-4">System Statistics</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            <div className="bg-zinc-800/50 p-6 rounded-lg">
                                <div className="text-2xl font-bold">{stats?.users?.toLocaleString() || 0}</div>
                                <div className="text-zinc-400 text-sm">Total Users</div>
                            </div>
                            <div className="bg-zinc-800/50 p-6 rounded-lg">
                                <div className="text-2xl font-bold">{stats?.artists || 0}</div>
                                <div className="text-zinc-400 text-sm">Verified Artists</div>
                            </div>
                            <div className="bg-zinc-800/50 p-6 rounded-lg">
                                <div className="text-2xl font-bold">{stats?.tracks?.toLocaleString() || 0}</div>
                                <div className="text-zinc-400 text-sm">Total Tracks</div>
                            </div>
                            <div className="bg-zinc-800/50 p-6 rounded-lg">
                                <div className="text-2xl font-bold text-green-400">{stats?.listens?.toLocaleString() || 0}</div>
                                <div className="text-zinc-400 text-sm">Total Plays</div>
                            </div>
                            <div className="bg-zinc-800/50 p-6 rounded-lg">
                                <div className="text-2xl font-bold text-blue-400">{newUsersCount}</div>
                                <div className="text-zinc-400 text-sm">New Users (7d)</div>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-zinc-800/50 p-6 rounded-lg">
                                <h3 className="font-bold mb-4">Plays Per Day (Last 7 Days)</h3>
                                <div className="h-40 flex items-end gap-2">
                                    {dailyPlays.length > 0 ? (
                                        dailyPlays.map((day, idx) => {
                                            const maxCount = Math.max(...dailyPlays.map(d => d.count), 1);
                                            const heightPercent = (day.count / maxCount) * 100;
                                            return (
                                                <div key={idx} className="flex-1 flex flex-col items-center">
                                                    <div
                                                        className="w-full bg-green-500/30 rounded-t"
                                                        style={{ height: `${Math.max(heightPercent, 5)}%` }}
                                                    />
                                                    <span className="text-xs text-zinc-500 mt-1">
                                                        {new Date(day.date).getDate()}
                                                    </span>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="text-zinc-500 text-sm w-full text-center">No data</div>
                                    )}
                                </div>
                            </div>
                            <div className="bg-zinc-800/50 p-6 rounded-lg">
                                <h3 className="font-bold mb-4">Top Tracks</h3>
                                <div className="space-y-2">
                                    {topTracks.length > 0 ? (
                                        topTracks.map((track, idx) => (
                                            <div key={track.id} className="flex justify-between text-sm">
                                                <span>{idx + 1}. {track.title}</span>
                                                <span className="text-zinc-400">{track.plays.toLocaleString()} plays</span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-zinc-500 text-sm">No tracks yet</div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="bg-zinc-800/50 p-6 rounded-lg">
                            <h3 className="font-bold mb-4">Top Artists</h3>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {topArtists.length > 0 ? (
                                    topArtists.map((artist, idx) => (
                                        <div key={artist.id} className="flex justify-between items-center p-3 bg-zinc-900/50 rounded">
                                            <div>
                                                <span className="text-zinc-500 mr-2">{idx + 1}.</span>
                                                <span>{artist.username}</span>
                                                {artist.verified && <span className="ml-2 text-green-400 text-xs">[Verified]</span>}
                                            </div>
                                            <span className="text-zinc-400 text-sm">{artist.totalPlays.toLocaleString()} plays</span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-zinc-500 text-sm">No artists yet</div>
                                )}
                            </div>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

            <div className="flex gap-2 mb-6 border-b border-zinc-800 pb-4">
                {tabs.map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === tab.key
                            ? 'bg-white text-black'
                            : 'bg-zinc-800 text-white hover:bg-zinc-700'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {renderContent()}
        </div>
    );
};

export default AdminDashboard;
