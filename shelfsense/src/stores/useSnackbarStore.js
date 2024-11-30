import { create } from 'zustand';

const useSnackbarStore = create((set) => ({
    snackbar: {
        open: false,
        severity: 'success',
        message: '',
        duration: 5000,
    },
    showSnackbar: (severity, message, duration = 5000) =>
        set(() => ({
            snackbar: { open: true, severity, message, duration },
        })),
    hideSnackbar: () =>
        set((state) => ({
            snackbar: { ...state.snackbar, open: false },
        })),
}));

export default useSnackbarStore;
