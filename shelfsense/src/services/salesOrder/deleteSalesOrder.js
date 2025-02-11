import {clearStoresAndLogout} from "../../util/user/clearStoresAndLogout.js";

export const deleteSalesOrder = async (id) => {
    const BASE_URL = `${import.meta.env.VITE_API_URL}/salesOrders/${id}`;
    try {
        const response = await fetch(BASE_URL, {
            method: 'DELETE',
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        });

        if (response.status === 401) {
            await clearStoresAndLogout();
            return null;
        }

        if (!response.ok) {
            console.error('Failed to delete sales order', response.status);
            return null;
        }
        return true;
    } catch (error) {
        console.error('Error while deleting sales order:', error);
        return null;
    }
};