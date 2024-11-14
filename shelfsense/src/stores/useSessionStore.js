import { create } from 'zustand';

const useSessionStore = create((set) => ({
    user: null,
    setUser: (userData) => set({ user: userData }),
    clearUser: () => set({ user: null })
}));

export default useSessionStore;
