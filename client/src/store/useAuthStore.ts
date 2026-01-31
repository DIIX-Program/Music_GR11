import { create } from 'zustand';
import api from '../services/api';

interface User {
    id: number;
    username: string;
    email: string;
    role: 'USER' | 'ADMIN';
    avatar?: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (credentials: any) => Promise<void>;
    register: (data: any) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: true,

    login: async (credentials) => {
        const res = await api.post('/auth/login', credentials);
        set({ user: res.data.data.user, isAuthenticated: true });
    },

    register: async (data) => {
        await api.post('/auth/register', data);
    },

    logout: async () => {
        await api.post('/auth/logout');
        set({ user: null, isAuthenticated: false });
    },

    checkAuth: async () => {
        try {
            const res = await api.get('/users/me');
            set({ user: res.data.data, isAuthenticated: true });
        } catch (error) {
            set({ user: null, isAuthenticated: false });
        } finally {
            set({ isLoading: false });
        }
    },
}));
