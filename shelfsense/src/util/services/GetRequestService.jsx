import {destroyStoresAndLogout} from "../destroyStoresAndLogout.js";

export const getRequest = async (url) => {
    const BASE_URL = `${import.meta.env.VITE_API_URL}/`;

    try {
        const response = await fetch(BASE_URL + url, {
            credentials: "include",
        });

        if (response.status === 401) {
            await destroyStoresAndLogout();
            return null;
        }

        if (!response.ok) {
            console.error('Get request for:', url, ' failed with status: ', response.status);
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error('Network error occurred while fetching:', url, error);
        return null;
    }
};