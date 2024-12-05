import { create } from "zustand";
import { persist } from 'zustand/middleware';

const useThemeStore = create(
    persist(
        (set) => ({
            mode: "dark",
            toggleTheme: () =>
                set((state) => ({
                    mode: state.mode === "dark" ? "light" : "dark",
                })),
        }),
        {
            name: "theme-storage", // Key for localStorage
            getStorage: () => localStorage, // Use localStorage
        }
    )
);

export default useThemeStore;
