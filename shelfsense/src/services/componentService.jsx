
const COMPONENTS_URL = 'http://localhost:8080/components';

export const fetchComponents = async () => {
    try {
        const response = await fetch(COMPONENTS_URL);
        if (!response.ok) throw new Error('Failed to fetch components');
        console.log(response);
        return await response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
};