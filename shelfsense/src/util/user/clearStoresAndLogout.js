import useSnackbarStore from "../../stores/useSnackbarStore.js";

export const clearStoresAndLogout = async () => {
    const showSnackbar = useSnackbarStore.getState().showSnackbar;
    showSnackbar('error', 'Unauthorized! Logging out and navigating to login page.');
    console.error("Unauthorized! Clearing the local storage, logging out and navigating to login page!");
    const keys = [
        'apiUpdate-store',
        'components-store',
        'products-store',
        'sales-orders-store',
        'user-session',
        'theme-storage',
        'sidebar-store',
    ];

    keys.forEach((key) => {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error(`Error removing ${key} from localStorage:`, error);
        }
    });

    await new Promise((resolve) => setTimeout(resolve, 2000));
    window.location.href = '/';
};

