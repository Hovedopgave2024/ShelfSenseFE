import {destroyStoresAndLogout} from "../../destroyStoresAndLogout.js";

const BASE_URL = `${import.meta.env.VITE_API_URL}/components`;

export const createComponent = async (componentData) => {

    try {
        const response = await fetch(BASE_URL, {
            method: "POST",
            headers: {"Content-Type": "application/json",},
            credentials: "include",
            body: JSON.stringify(componentData),
        });

        if (response.status === 401) {
            await destroyStoresAndLogout();
            return null;
        }

        if (!response.ok) {
            console.error('Failed to create component:', response.status);
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error('Error occurred while creating component:', error);
        return null;
    }
};