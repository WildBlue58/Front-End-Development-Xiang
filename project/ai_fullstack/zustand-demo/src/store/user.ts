import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';

interface UserState {
    isLoggedIn: boolean;
    login: (user: User) => void;
    logout: () => void;
    user:User | null;
}

export const useUserStore = create<UserState>()(
    persist((set) => ({
        isLoggedIn: false,
        login: (user) => set({ isLoggedIn: true, user: { ...user, id: Date.now() } }),
        logout: () => set({ isLoggedIn: false, user: null }),
        user: null,
    }), {
        name: 'user',
    }));