import useSnackbarStore from "../../stores/useSnackbarStore.js";

export const clearStoresAndLogout = async () => {
    const showSnackbar = useSnackbarStore.getState().showSnackbar;
    try {
        showSnackbar('error', 'Unauthorized! Logging out and navigating to login page.');
        console.error("Unauthorized! Logging out and navigating to login page!");
        localStorage.removeItem('apiUpdate-store');
        localStorage.removeItem('components-store');
        localStorage.removeItem('products-store');
        localStorage.removeItem('sales-orders-store');
        localStorage.removeItem('user-session');
        localStorage.removeItem('theme-storage');
        localStorage.removeItem('sidebar-store');

        await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
        console.error('Error during unauthorized logout and store cleanup or redirection:', error);
    }
        window.location.href = '/';
};

