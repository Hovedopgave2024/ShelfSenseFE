
const PRODUCTS_URL = `${import.meta.env.VITE_API_URL}/products`;

export const fetchProducts = async () => {
    try {
        const response = await fetch(PRODUCTS_URL, {
            credentials: "include",
        });
        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }
        const products = await response.json();
        console.log(products);
        return products;
    } catch (error) {
        console.error(error);
        return null;
    }
};