import { create } from 'zustand';

const useSnackbarStore = create((set) => ({
    snackbar: {
        open: false,
        severity: 'success',
        message: '',
    },
    showSnackbar: (severity, message) =>
        set(() => ({
            snackbar: { open: true, severity, message },
        })),
    hideSnackbar: () =>
        set((state) => ({
            snackbar: { ...state.snackbar, open: false },
        })),
}));

export default useSnackbarStore;