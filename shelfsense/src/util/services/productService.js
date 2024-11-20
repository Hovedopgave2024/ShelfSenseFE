import { getRequest } from './getRequestService.js';

export const fetchComponents = async () => {
    return await getRequest(`products`);
};

export const createProduct = async (productData) => {
    const BASE_URL = `${import.meta.env.VITE_API_URL}/products`;

    try {
        const response = await fetch(BASE_URL, {
            method: "POST",
            headers: {"Content-Type": "application/json",},
            credentials: "include",
            body: JSON.stringify(productData),
        });

        if (response.status === 401) {
            console.error('Unauthorized request while creating product.');
            return null;
        }

        if (!response.ok) {
            console.error('Failed to create product:', response.status);
            return null;
        }

        const data = await response.json();
        console.log('Created product:', data); // Log the response entity
        return data;

    } catch (error) {
        console.error('Error occurred while creating product:', error);
        return null;
    }
};

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
                console.error('Unauthorized request while creating product components.');
                return null;
            }

            if (!response.ok) {
                console.error('Failed to create product components:', response.status);
                return null;
            }

            const data = await response.json();
            console.log('Created product components:', data);
            return data;
        } catch (error) {
            console.error('Error occurred while creating product components:', error);
            return null;
        }
};


