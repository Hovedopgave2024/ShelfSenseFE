
const PRODUCTS_URL = 'http://localhost:8080/products';

export const fetchProducts = async () => {
    try {
        const response = await fetch(PRODUCTS_URL);
        if (!response.ok) throw new Error('Failed to fetch products');
        console.log(response);
        return await response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
};