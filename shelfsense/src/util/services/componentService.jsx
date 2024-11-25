import { getRequest } from './getRequestService.jsx';

export const fetchComponents = async () => {
    return await getRequest(`components`);
};

export const createComponent = async (componentData) => {
    const BASE_URL = `${import.meta.env.VITE_API_URL}/components`;

    try {
        const response = await fetch(BASE_URL, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            credentials: "include",
            body: JSON.stringify(componentData),
        });

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

export const updateComponent = async (id, updatedData) => {
    const BASE_URL = `${import.meta.env.VITE_API_URL}/components/${id}`;

    try {
        const response = await fetch(BASE_URL, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(updatedData),
        });

        if (!response.ok) {
            console.error('Failed to update component:', response.status);
            return null;
        }
        return await response.json();
    } catch (error) {
        console.error('Error updating component:', error);
        return null;
    }
};

export const deleteComponent = async (id) => {
    const BASE_URL = `${import.meta.env.VITE_API_URL}/components/${id}`;

    try {
        const response = await fetch(BASE_URL, {
            method: "DELETE",
            credentials: "include",
        });

        if (!response.ok) {
            console.error('Failed to delete component:', response.status);
            return false;
        }

        return true; // Return true if deletion was successful
    } catch (error) {
        console.error('Error occurred while deleting component:', error);
        return false;
    }
};

