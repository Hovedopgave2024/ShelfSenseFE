import useSnackbarStore from "../../../stores/useSnackbarStore.js";

export const login = async (name, password) => {

    const LOGIN_URL = `${import.meta.env.VITE_API_URL}/login`;
    const showSnackbar = useSnackbarStore.getState().showSnackbar;

    try {
        const response = await fetch(LOGIN_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ name, password }),
        });

        if (response.status === 401) {
            showSnackbar('error', 'Username or password is wrong, please try again.');
            console.error("Login failed: ", response);
            return null;
        }
        if (!response.ok) {
            showSnackbar('error', 'Unexpected error. Please try again, check your network connection or contact Support.');
            console.error("Login failed: ", response);
            return null;
        }
        return await response.json();
    } catch (error) {
        showSnackbar('error', 'Network error or server is not responding. Please try again, check your network connection or contact Support.');
        console.error(error);
        return null;
    }
};