import useSnackbarStore from "../../stores/useSnackbarStore.js";

export const destroyStoresAndLogout = async () => {
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

        await new Promise((resolve) => setTimeout(resolve, 2000));
        window.location.href = '/';
    } catch (error) {
        console.error('Error during unauthorized logout and store cleanup or redirection:', error);
    }
};

