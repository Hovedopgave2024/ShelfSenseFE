import { getRequest } from './GetRequestService.jsx';
import { CheckCircleOutlined, WarningOutlined, ErrorOutlined } from '@mui/icons-material';
import useProductsStore from "../../stores/useProductsStore.js";

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
            console.error('Unauthorized request while updating product components.');
            return null;
        }

        if (!response.ok) {
            console.error('Failed to update product components:', response.status);
            return null;
        }

        const updatedProduct = await response.json();
        useProductsStore.getState().updateProduct(updatedProduct);
        return updatedProduct;
    } catch (error) {
        console.error('Error in updateProduct:', error);
        throw error;
    }
};

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
            console.error('Unauthorized request while removing product components.');
            return null;
        }

        if (!response.ok) {
            console.error('Failed to remove product components:', response.status);
            return null;
        }
        useProductsStore.getState().deleteProduct(product.id);
        return await response.json();
    } catch (error) {
        console.error('Error in updateProduct:', error);
        throw error;
    }
};





