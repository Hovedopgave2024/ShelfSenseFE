import {clearStoresAndLogout} from "../../util/user/clearStoresAndLogout.js";

export const deleteComponent = async (id) => {
    const BASE_URL = `${import.meta.env.VITE_API_URL}/components/${id}`;

    try {
        const response = await fetch(BASE_URL, {
            method: "DELETE",
            credentials: "include",
        });

        if (response.status === 401) {
            await clearStoresAndLogout();
            return null;
        }

        if (!response.ok) {
            console.error('Cannot delete component as it is associated with a product.');
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error occurred while deleting component:', error);
        return null;
    }
};