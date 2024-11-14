
const BASE_URL = `${import.meta.env.VITE_API_URL}`;

export const fetchProducts = async (url, options = {}) => {
    const clearUser = useSessionStore.getState().clearUser;
    const navigate = useNavigate();

    try {
        const response = await fetch(BASE_URL + url, {
            ...options,
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