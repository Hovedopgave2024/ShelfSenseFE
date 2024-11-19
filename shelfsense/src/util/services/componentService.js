import { getRequest } from './getRequestService.js';

export const fetchComponents = async () => {
    return await getRequest(`components`);
};

export const createComponent = async (componentData) => {
    const BASE_URL = `${import.meta.env.VITE_API_URL}/components`; // API endpoint for creating component

    try {
        const response = await fetch(BASE_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include", // to include the session cookie
            body: JSON.stringify(componentData),
        });

        if (response.status === 401) {
            console.error('Unauthorized request while creating component.');
            return null;
        }

        if (!response.ok) {
            console.error('Failed to create component:', response.status);
            return null;
        }

        // If the request was successful, return the created component
        return await response.json();
    } catch (error) {
        console.error('Error occurred while creating component:', error);
        return null;
    }
};