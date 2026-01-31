import { useState, useEffect } from 'react';
import { artistAPI } from '../services/api';

type ArtistTab = 'uploads' | 'stats' | 'earnings' | 'verification';

interface Track {
    id: number;
    title: string;
    plays: number;
    status: string;
    coverImage: string | null;
    createdAt: string;
}

interface Stats {
    totalPlays: number;
    uniqueListeners: number;
    totalTracks: number;
    verified: boolean;
}

interface Earnings {
    total: number;
    pending: number;
    thisMonth: number;
}

interface VerificationStatus {
    verified: boolean;
    latestRequest: {
        status: string;
        submittedAt: string;
        reviewedAt: string | null;
        notes: string | null;
    } | null;
}

const ArtistDashboard = () => {
    const [activeTab, setActiveTab] = useState<ArtistTab>('stats');
    const [loading, setLoading] = useState(false);

    const [tracks, setTracks] = useState<Track[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [earnings, setEarnings] = useState<Earnings | null>(null);
    const [followers, setFollowers] = useState(0);
    const [verificationStatus, setVerificationStatus] = useState<VerificationStatus | null>(null);

    const tabs = [
        { key: 'stats', label: 'Statistics' },
        { key: 'uploads', label: 'My Uploads' },
        { key: 'earnings', label: 'Earnings' },
        { key: 'verification', label: 'Verification' },
    ] as const;

    useEffect(() => {
        if (activeTab === 'stats') {
            loadStats();
        } else if (activeTab === 'uploads') {
            loadTracks();
        } else if (activeTab === 'earnings') {
            loadEarnings();
        } else if (activeTab === 'verification') {
            loadVerificationStatus();
        }
    }, [activeTab]);

    const loadStats = async () => {
        setLoading(true);
        try {
            const [statsRes, followersRes] = await Promise.all([
                artistAPI.getStats(),
                artistAPI.getFollowers(),
            ]);
            setStats(statsRes.data.data);
            setFollowers(followersRes.data.data?.followers || 0);
        } catch (error) {
            console.error('Failed to load stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadTracks = async () => {
        setLoading(true);
        try {
            const res = await artistAPI.getMyTracks();
            setTracks(res.data.data || []);
        } catch (error) {
            console.error('Failed to load tracks:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadEarnings = async () => {
        setLoading(true);
        try {
            const res = await artistAPI.getEarnings();
            setEarnings(res.data.data);
        } catch (error) {
            console.error('Failed to load earnings:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadVerificationStatus = async () => {
        setLoading(true);
        try {
            const res = await artistAPI.getVerificationStatus();
            setVerificationStatus(res.data.data);
        } catch (error) {
            console.error('Failed to load verification status:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteTrack = async (trackId: number) => {
        if (!confirm('Are you sure you want to delete this track?')) return;
        try {
            await artistAPI.deleteTrack(trackId);
            loadTracks();
        } catch (error) {
            console.error('Failed to delete track:', error);
        }
    };

    const handleSubmitVerification = async () => {
        const reason = prompt('Why should you be verified? (optional)');
        try {
            await artistAPI.submitVerification(reason || undefined);
            loadVerificationStatus();
        } catch (error) {
            console.error('Failed to submit verification:', error);
            alert('Failed to submit verification request');
        }
    };

    const renderContent = () => {
        if (loading) {
            return <div className="text-center py-8 text-zinc-400">Loading...</div>;
        }

        switch (activeTab) {
            case 'uploads':
                return (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-bold">My Tracks ({tracks.length})</h2>
                            <button className="bg-green-500 text-black px-4 py-2 rounded font-medium text-sm hover:bg-green-400">
                                + Upload New Track
                            </button>
                        </div>
                        {tracks.length === 0 ? (
                            <p className="text-zinc-400">You haven't uploaded any tracks yet.</p>
                        ) : (
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left text-zinc-400 text-sm border-b border-zinc-800">
                                        <th className="pb-3">Title</th>
                                        <th className="pb-3">Plays</th>
                                        <th className="pb-3">Status</th>
                                        <th className="pb-3">Uploaded</th>
                                        <th className="pb-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tracks.map(track => (
                                        <tr key={track.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                                            <td className="py-4 text-sm">{track.title}</td>
                                            <td className="py-4 text-sm text-zinc-400">{track.plays.toLocaleString()}</td>
                                            <td className="py-4">
                                                <span className={`text-xs px-2 py-1 rounded ${track.status === 'APPROVED' ? 'bg-green-500/20 text-green-400' :
                                                    track.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-400' :
                                                        'bg-red-500/20 text-red-400'
                                                    }`}>
                                                    {track.status}
                                                </span>
                                            </td>
                                            <td className="py-4 text-sm text-zinc-400">
                                                {new Date(track.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="py-4">
                                                <button className="text-zinc-400 hover:text-white text-sm mr-3">Edit</button>
                                                <button
                                                    onClick={() => handleDeleteTrack(track.id)}
                                                    className="text-red-400 hover:text-red-300 text-sm"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                );
            case 'stats':
                return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-zinc-800/50 p-6 rounded-lg">
                                <div className="text-2xl font-bold">{stats?.totalPlays?.toLocaleString() || 0}</div>
                                <div className="text-zinc-400 text-sm">Total Plays</div>
                            </div>
                            <div className="bg-zinc-800/50 p-6 rounded-lg">
                                <div className="text-2xl font-bold">{stats?.uniqueListeners?.toLocaleString() || 0}</div>
                                <div className="text-zinc-400 text-sm">Unique Listeners</div>
                            </div>
                            <div className="bg-zinc-800/50 p-6 rounded-lg">
                                <div className="text-2xl font-bold">{stats?.totalTracks || 0}</div>
                                <div className="text-zinc-400 text-sm">Total Tracks</div>
                            </div>
                            <div className="bg-zinc-800/50 p-6 rounded-lg">
                                <div className="text-2xl font-bold text-purple-400">{followers}</div>
                                <div className="text-zinc-400 text-sm">Followers</div>
                            </div>
                        </div>

                        <div className="bg-zinc-800/50 p-6 rounded-lg">
                            <h3 className="font-bold mb-4">Verification Status</h3>
                            {stats?.verified ? (
                                <p className="text-green-400">[Verified] Your account is verified.</p>
                            ) : (
                                <p className="text-zinc-400">Your account is not verified yet. Go to the Verification tab to apply.</p>
                            )}
                        </div>
                    </div>
                );
            case 'earnings':
                return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-zinc-800/50 p-6 rounded-lg">
                                <div className="text-2xl font-bold text-green-400">${earnings?.total?.toFixed(2) || '0.00'}</div>
                                <div className="text-zinc-400 text-sm">Total Earnings</div>
                            </div>
                            <div className="bg-zinc-800/50 p-6 rounded-lg">
                                <div className="text-2xl font-bold text-yellow-400">${earnings?.pending?.toFixed(2) || '0.00'}</div>
                                <div className="text-zinc-400 text-sm">Pending Payout</div>
                            </div>
                            <div className="bg-zinc-800/50 p-6 rounded-lg">
                                <div className="text-2xl font-bold">${earnings?.thisMonth?.toFixed(2) || '0.00'}</div>
                                <div className="text-zinc-400 text-sm">This Month</div>
                            </div>
                        </div>
                        <div className="bg-zinc-800/50 p-6 rounded-lg">
                            <h3 className="font-bold mb-4">Earnings Info</h3>
                            <p className="text-zinc-400 text-sm">
                                Earnings are calculated at $0.004 per play. Payouts are processed monthly for verified artists.
                            </p>
                        </div>
                    </div>
                );
            case 'verification':
                return (
                    <div className="space-y-6">
                        <div className="bg-zinc-800/50 p-6 rounded-lg">
                            <h3 className="font-bold mb-4">Verification Status</h3>
                            {verificationStatus?.verified ? (
                                <div className="text-green-400">
                                    [Verified] Congratulations! Your artist account is verified.
                                </div>
                            ) : verificationStatus?.latestRequest ? (
                                <div>
                                    <div className="mb-2">
                                        <span className="text-zinc-400">Status: </span>
                                        <span className={`px-2 py-1 rounded text-xs ${verificationStatus.latestRequest.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-400' :
                                                verificationStatus.latestRequest.status === 'APPROVED' ? 'bg-green-500/20 text-green-400' :
                                                    'bg-red-500/20 text-red-400'
                                            }`}>
                                            {verificationStatus.latestRequest.status}
                                        </span>
                                    </div>
                                    <div className="text-sm text-zinc-400">
                                        Submitted: {new Date(verificationStatus.latestRequest.submittedAt).toLocaleDateString()}
                                    </div>
                                    {verificationStatus.latestRequest.notes && (
                                        <div className="mt-2 text-sm text-red-400">
                                            Rejection reason: {verificationStatus.latestRequest.notes}
                                        </div>
                                    )}
                                    {verificationStatus.latestRequest.status === 'REJECTED' && (
                                        <button
                                            onClick={handleSubmitVerification}
                                            className="mt-4 bg-green-500 text-black px-4 py-2 rounded font-medium text-sm hover:bg-green-400"
                                        >
                                            Submit New Request
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div>
                                    <p className="text-zinc-400 mb-4">
                                        Get verified to unlock payouts and a verified badge on your profile.
                                    </p>
                                    <button
                                        onClick={handleSubmitVerification}
                                        className="bg-green-500 text-black px-4 py-2 rounded font-medium text-sm hover:bg-green-400"
                                    >
                                        Request Verification
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Artist Dashboard</h1>

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

export default ArtistDashboard;
