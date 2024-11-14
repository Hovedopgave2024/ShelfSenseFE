
const PRODUCTS_URL = `${import.meta.env.VITE_API_URL}/products`;

export const fetchProducts = async () => {
    try {
        const response = await fetch(PRODUCTS_URL, {
            credentials: "include",
        });
        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }
        console.log(response);
        return await response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
};