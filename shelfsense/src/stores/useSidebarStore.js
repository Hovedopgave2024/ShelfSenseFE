import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useSidebarStore = create(
    persist(
        (set) => ({
            isOpen: true, // Tracks whether the sidebar is open or collapsed
            activePage: '/', // Tracks the currently active page for highlighting

            // Toggles the sidebar open/collapsed state
            toggleSidebar: () =>
                set((state) => ({ isOpen: !state.isOpen })),

            // Sets the active page
            setActivePage: (page) =>
                set(() => ({ activePage: page })),
        }),
        {
            name: 'sidebar-store', // Key for localStorage
            getStorage: () => localStorage, // Persist state in localStorage
        }
    )
);

export default useSidebarStore;
