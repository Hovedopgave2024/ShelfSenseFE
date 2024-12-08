import useSessionStore from "../../stores/useSessionStore.js";
import useApiUpdateStore from "../../stores/useApiUpdateStore.js";
import {destroyStoresAndLogout} from "../destroyStoresAndLogout.js";

const BASE_URL = `${import.meta.env.VITE_API_URL}/components`;

export const deleteComponent = async (id) => {
    const BASE_URL = `${import.meta.env.VITE_API_URL}/components/${id}`;

    try {
        const response = await fetch(BASE_URL, {
            method: "DELETE",
            credentials: "include",
        });

        if (response.status === 401) {
            await destroyStoresAndLogout();
            return null;
        }

        if (!response.ok) {
            console.log('Cannot delete component as it is associated with a product.');
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error occurred while deleting component:', error);
        return null;
    }
};

export const createApiRequest = async () => {

    const user = useSessionStore.getState().user;

    const sendApiRequest = {
        userId: user.id,
        apiKey: import.meta.env.VITE_API_KEY,
    };

    console.log(sendApiRequest);

    try{
        const response = await fetch(`${BASE_URL}/mouser`, {
            method: "POST",
            headers: {"Content-Type": "application/json",},
            credentials: "include",
            body: JSON.stringify(sendApiRequest),
        });

        if (response.status === 401) {
            await destroyStoresAndLogout();
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

        console.log(getLocalDateTime());

        console.log("Last Updated: ", useApiUpdateStore.getState().apiUpdate);
        console.log("Time now: ", getLocalDateTime());
        return await response.json();
    } catch (error) {
        console.error('Error occurred while creating component:', error);
        return null;
    }
}

