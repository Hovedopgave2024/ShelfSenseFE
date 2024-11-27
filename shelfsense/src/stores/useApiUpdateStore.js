import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useApiUpdateStore = create(
    persist(
        (set) => ({
            apiUpdate: null, // Use the correct key consistently
            setApiUpdate: (update) => set(() => ({ apiUpdate: update })), // Correct key
        }),
        {
            name: 'apiUpdate-store',
            getStorage: () => localStorage,
        }
    )
);

export default useApiUpdateStore;