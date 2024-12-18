import {clearStoresAndLogout} from "../../util/user/clearStoresAndLogout.js";

export const updateProduct = async (product) => {
    const BASE_URL = `${import.meta.env.VITE_API_URL}/products`;
    try {
        const response = await fetch(BASE_URL, {
            method: 'PUT',
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(product),
        });

        if (response.status === 401) {
            await clearStoresAndLogout();
            return null;
        }

        if (!response.ok) {
            console.error('Failed to update product components:', response.status);
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error('Error in updateProduct:', error);
        return null;
    }
};