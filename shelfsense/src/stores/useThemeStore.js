import { create } from "zustand";
import { persist } from 'zustand/middleware';

const useThemeStore = create(
    persist(
        (set) => ({
            mode: "light",
            toggleTheme: () =>
                set((state) => ({
                    mode: state.mode === "light" ? "dark" : "light",
                })),
        }),
        {
            name: "theme-storage", // Key for localStorage
            getStorage: () => localStorage, // Use localStorage
        }
    )
);

export default useThemeStore;
