
const COMPONENTS_URL = `${import.meta.env.VITE_API_URL}/components`;

export const fetchComponents = async () => {
    try {
        const response = await fetch(COMPONENTS_URL, {
            credentials: "include",
        });
        if (!response.ok) {
            throw new Error('Failed to fetch components');
        }
        console.log(response);
        return await response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
};