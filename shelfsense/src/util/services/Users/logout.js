import useSnackbarStore from "../../../stores/useSnackbarStore.js";

export const logout = async () => {
    const LOGOUT_URL = `${import.meta.env.VITE_API_URL}/logout`;
    const showSnackbar = useSnackbarStore.getState().showSnackbar;

    try {
        const response = await fetch(LOGOUT_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        });

        if (!response.ok) {
            showSnackbar('error', 'Server error. Logging out from your device. Navigating to login page.');
            console.error('Logout failed on server:', response);
        }

        showSnackbar('success', 'Logout successful. Navigating to login page. See you soon!');
    } catch (error) {
        // Handle network or other fetch-related errors
        showSnackbar('error', 'Server or network error. Logging out from your device. Navigating to login page.');
        console.error('Logout error:', error);
    } finally {
        // Clear local data regardless of the result
        localStorage.removeItem('apiUpdate-store');
        localStorage.removeItem('components-store');
        localStorage.removeItem('products-store');
        localStorage.removeItem('sales-orders-store');
        localStorage.removeItem('user-session');
        localStorage.removeItem('theme-storage');

        await new Promise((resolve) => setTimeout(resolve, 2000));
        window.location.href = '/';
    }
};