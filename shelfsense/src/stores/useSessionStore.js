import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useSessionStore = create(
    persist(
        (set) => ({
            user: null,
            setUser: (userData) => set({ user: userData }),
            clearUser: () => set({ user: null }),
        }),
        {
            name: 'user-session',  // Key for localStorage
            getStorage: () => localStorage,  // Use localStorage to persist state
        }
    )
);
export default useSessionStore;
