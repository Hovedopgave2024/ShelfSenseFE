export const getRequest = async (url) => {

    const BASE_URL = `${import.meta.env.VITE_API_URL}/`;

    try {
        const response = await fetch(BASE_URL + url, {
            credentials: "include",
        });
        if (!response.ok) {
            console.error('Failed to fetch products');
            return null;
        }
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
};