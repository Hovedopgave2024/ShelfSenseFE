import {clearStoresAndLogout} from "../../util/user/clearStoresAndLogout.js";

export const createProductComponents = async (productComponentsData) => {
    const BASE_URL = `${import.meta.env.VITE_API_URL}/productComponents`;

    try {
        const response = await fetch(BASE_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(productComponentsData),
        });

        if (response.status === 401) {
            await clearStoresAndLogout();
            return null;
        }

        if (!response.ok) {
            console.error('Failed to create product components:', response.status);
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error('Error occurred while creating product components:', error);
        return null;
    }
};