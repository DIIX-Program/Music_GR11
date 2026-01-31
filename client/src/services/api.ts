import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    withCredentials: true,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                await axios.post('http://localhost:5000/api/auth/refresh', {}, { withCredentials: true });
                return api(originalRequest);
            } catch (err) {
                return Promise.reject(err);
            }
        }
        return Promise.reject(error);
    }
);

// ===== AUTH =====
export const authAPI = {
    login: (data: { email: string; password: string }) => api.post('/auth/login', data),
    register: (data: { username: string; email: string; password: string }) => api.post('/auth/register', data),
    logout: () => api.post('/auth/logout'),
    refresh: () => api.post('/auth/refresh'),
    me: () => api.get('/auth/me'),
};

// ===== TRACKS =====
export const tracksAPI = {
    getAll: (params?: { page?: number; limit?: number }) => api.get('/tracks', { params }),
    getById: (id: number) => api.get(`/tracks/${id}`),
    stream: (id: number) => `http://localhost:5000/api/tracks/${id}/stream`,
};

// ===== FAVORITES =====
export const favoritesAPI = {
    getAll: (params?: { page?: number; limit?: number }) => api.get('/favorites', { params }),
    add: (trackId: number) => api.post(`/favorites/${trackId}`),
    remove: (trackId: number) => api.delete(`/favorites/${trackId}`),
    check: (trackId: number) => api.get(`/favorites/${trackId}/check`),
};

// ===== PLAYLISTS =====
export const playlistsAPI = {
    getAll: (params?: { page?: number; limit?: number }) => api.get('/playlists', { params }),
    getById: (id: number) => api.get(`/playlists/${id}`),
    create: (data: { name: string; description?: string; isPublic?: boolean }) => api.post('/playlists', data),
    update: (id: number, data: { name?: string; description?: string; isPublic?: boolean }) => api.put(`/playlists/${id}`, data),
    delete: (id: number) => api.delete(`/playlists/${id}`),
    addTrack: (id: number, trackId: number) => api.post(`/playlists/${id}/tracks`, { trackId }),
    removeTrack: (id: number, trackId: number) => api.delete(`/playlists/${id}/tracks/${trackId}`),
};

// ===== ALBUMS =====
export const albumsAPI = {
    getAll: (params?: { page?: number; limit?: number; artistId?: number }) => api.get('/albums', { params }),
    getById: (id: number) => api.get(`/albums/${id}`),
    create: (data: { title: string; coverImage?: string; releaseDate?: string }) => api.post('/albums', data),
    update: (id: number, data: { title?: string; coverImage?: string; releaseDate?: string }) => api.put(`/albums/${id}`, data),
    delete: (id: number) => api.delete(`/albums/${id}`),
    addTrack: (id: number, trackId: number) => api.post(`/albums/${id}/tracks`, { trackId }),
    removeTrack: (id: number, trackId: number) => api.delete(`/albums/${id}/tracks/${trackId}`),
    getMyAlbums: () => api.get('/albums/me/albums'),
};

// ===== NOTIFICATIONS =====
export const notificationsAPI = {
    getAll: (params?: { page?: number; limit?: number; unread?: boolean }) => api.get('/notifications', { params }),
    getUnreadCount: () => api.get('/notifications/unread-count'),
    markAsRead: (id: number) => api.patch(`/notifications/${id}/read`),
    markAllAsRead: () => api.patch('/notifications/read-all'),
    delete: (id: number) => api.delete(`/notifications/${id}`),
};

// ===== ARTIST =====
export const artistAPI = {
    getStats: () => api.get('/artist/stats'),
    getMyTracks: () => api.get('/artist/tracks'),
    uploadTrack: (data: FormData) => api.post('/artist/tracks', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    updateTrack: (id: number, data: Record<string, unknown>) => api.put(`/artist/tracks/${id}`, data),
    deleteTrack: (id: number) => api.delete(`/artist/tracks/${id}`),
    getEarnings: () => api.get('/artist/earnings'),
    getVerificationStatus: () => api.get('/artist/verification'),
    submitVerification: (reason?: string) => api.post('/artist/verification', { reason }),
    getPlaysPerTrack: () => api.get('/artist/analytics/plays-per-track'),
    getFollowers: () => api.get('/artist/analytics/followers'),
};

// ===== ADMIN =====
export const adminAPI = {
    getStats: () => api.get('/admin/stats'),
    getDailyPlays: (days?: number) => api.get('/admin/analytics/daily-plays', { params: { days } }),
    getTopTracks: (limit?: number) => api.get('/admin/analytics/top-tracks', { params: { limit } }),
    getTopArtists: (limit?: number) => api.get('/admin/analytics/top-artists', { params: { limit } }),
    getNewUsers: (days?: number) => api.get('/admin/analytics/new-users', { params: { days } }),
    getUsers: (params?: { page?: number; limit?: number; role?: string; search?: string }) => api.get('/admin/users', { params }),
    updateUser: (id: number, data: { role?: string; isActive?: boolean }) => api.put(`/admin/users/${id}`, data),
    toggleUserBlock: (id: number, blocked: boolean) => api.patch(`/admin/users/${id}/block`, { blocked }),
    getVerificationRequests: (params?: { page?: number; limit?: number; status?: string }) => api.get('/admin/verifications', { params }),
    approveVerification: (id: number) => api.post(`/admin/verifications/${id}/approve`),
    rejectVerification: (id: number, notes?: string) => api.post(`/admin/verifications/${id}/reject`, { notes }),
};

// ===== SEARCH =====
export const searchAPI = {
    search: (query: string, params?: { type?: string; page?: number; limit?: number }) =>
        api.get('/search', { params: { q: query, ...params } }),
};

export default api;

