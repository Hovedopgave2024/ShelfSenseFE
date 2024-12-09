import {destroyStoresAndLogout} from "../Users/destroyStoresAndLogout.js";

export const deleteProduct = async (product) => {
    const BASE_URL = `${import.meta.env.VITE_API_URL}/products`;
    try {
        const response = await fetch(BASE_URL, {
            method: 'DELETE',
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(product),
        });

        if (response.status === 401) {
            await destroyStoresAndLogout();
            return null;
        }

        if (!response.ok) {
            console.error('Failed to remove product components:', response.status);
            return null;
        }
        return true;
    } catch (error) {
        console.error('Error in updateProduct:', error);
        return null;
    }
};