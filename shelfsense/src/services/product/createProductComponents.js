import {destroyStoresAndLogout} from "../../util/user/destroyStoresAndLogout.js";

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
            await destroyStoresAndLogout();
            return null;
        }

        if (!response.ok) {
            console.error('Failed to create product components:', response.status);
            return null;
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error occurred while creating product components:', error);
        return null;
    }
};