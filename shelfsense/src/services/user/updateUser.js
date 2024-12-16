import useSnackbarStore from "../../stores/useSnackbarStore.js";
import {destroyStoresAndLogout} from "../../util/user/destroyStoresAndLogout.js";

export const updateUser = async (updatedData) => {
    const BASE_URL = `${import.meta.env.VITE_API_URL}/users`;
    const showSnackbar = useSnackbarStore.getState().showSnackbar;

    try {
        const response = await fetch(BASE_URL, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(updatedData),
        });

        if (response.status === 400) {
            showSnackbar("error", "Requirements for updating user were not met (probably wrong old password), please try again.")
            console.error('Failed to update user:', response.status);
            return null;
        }
        if (response.status === 401) {
            await destroyStoresAndLogout();
            return null;
        }

        if (!response.ok) {
            showSnackbar("error", "Failed to update user, please try again or contact Support")
            console.error('Failed to update user:', response.status);
            return null;
        }
        return await response.json();
    } catch (error) {
        console.error('Error updating user:', error);
        return null;
    }
};