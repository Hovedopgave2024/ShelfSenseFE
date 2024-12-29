import useSessionStore from "../../stores/useSessionStore.js";
import {clearStoresAndLogout} from "../../util/user/clearStoresAndLogout.js";
import useApiUpdateStore from "../../stores/useApiUpdateStore.js";

export const createApiRequest = async () => {
    const BASE_URL = `${import.meta.env.VITE_API_URL}/components/mouser`;

    const user = useSessionStore.getState().user;

    const sendApiRequest = {
        userId: user.id,
        apiKey: import.meta.env.VITE_API_KEY,
    };

    try{
        const response = await fetch(`${BASE_URL}`, {
            method: "POST",
            headers: {"Content-Type": "application/json",},
            credentials: "include",
            body: JSON.stringify(sendApiRequest),
        });

        if (response.status === 401) {
            await clearStoresAndLogout();
            return null;
        }

        if (!response.ok) {
            console.error('Failed to create component:', response.status);
            return null;
        }

        const getLocalDateTime = () => {
            const now = new Date();
            return now.toISOString();
        };

        useApiUpdateStore.getState().setApiUpdate({ lastUpdated: getLocalDateTime() });

        return await response.json();
    } catch (error) {
        console.error('Error occurred while creating component:', error);
        return null;
    }
}