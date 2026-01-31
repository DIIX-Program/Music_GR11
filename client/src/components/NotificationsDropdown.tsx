import { useState, useEffect, useRef } from 'react';
import { notificationsAPI } from '../services/api';

interface Notification {
    id: number;
    type: string;
    message: string;
    isRead: boolean;
    createdAt: string;
}

const NotificationsDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        loadUnreadCount();
        const interval = setInterval(loadUnreadCount, 60000); // Poll every minute
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (isOpen) {
            loadNotifications();
        }
    }, [isOpen]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const loadUnreadCount = async () => {
        try {
            const res = await notificationsAPI.getUnreadCount();
            setUnreadCount(res.data.data?.count || 0);
        } catch (error) {
            console.error('Failed to load unread count:', error);
        }
    };

    const loadNotifications = async () => {
        setLoading(true);
        try {
            const res = await notificationsAPI.getAll({ limit: 10 });
            setNotifications(res.data.data?.notifications || []);
        } catch (error) {
            console.error('Failed to load notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (id: number) => {
        try {
            await notificationsAPI.markAsRead(id);
            setNotifications(prev =>
                prev.map(n => n.id === id ? { ...n, isRead: true } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Failed to mark as read:', error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await notificationsAPI.markAllAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Failed to mark all as read:', error);
        }
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'LIKE': return '[Like]';
            case 'NEW_TRACK': return '[New]';
            case 'VERIFICATION_APPROVED': return '[Verified]';
            case 'VERIFICATION_REJECTED': return '[Rejected]';
            case 'PLAYLIST_FOLLOWED': return '[Follow]';
            default: return '[Info]';
        }
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    return (
        <div ref={dropdownRef} className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 hover:bg-zinc-800 rounded-full transition-colors"
            >
                <span className="text-zinc-400">Notifications</span>
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 top-12 w-80 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl z-50">
                    <div className="flex items-center justify-between p-3 border-b border-zinc-800">
                        <h3 className="font-bold text-sm">Notifications</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllAsRead}
                                className="text-xs text-green-400 hover:text-green-300"
                            >
                                Mark all read
                            </button>
                        )}
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {loading ? (
                            <div className="p-4 text-center text-zinc-400 text-sm">Loading...</div>
                        ) : notifications.length === 0 ? (
                            <div className="p-4 text-center text-zinc-400 text-sm">No notifications</div>
                        ) : (
                            notifications.map(notification => (
                                <div
                                    key={notification.id}
                                    onClick={() => !notification.isRead && handleMarkAsRead(notification.id)}
                                    className={`p-3 flex items-start gap-3 hover:bg-zinc-800/50 cursor-pointer border-b border-zinc-800/50 last:border-0 ${!notification.isRead ? 'bg-zinc-800/30' : ''
                                        }`}
                                >
                                    <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                                    <div className="flex-1">
                                        <p className="text-sm">{notification.message}</p>
                                        <span className="text-xs text-zinc-500">{formatTime(notification.createdAt)}</span>
                                    </div>
                                    {!notification.isRead && (
                                        <span className="text-green-400 text-xs font-bold">[New]</span>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationsDropdown;
