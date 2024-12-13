import {destroyStoresAndLogout} from "../../util/user/destroyStoresAndLogout.js";

export const deleteSalesOrder = async (salesOrderData) => {
    const BASE_URL = `${import.meta.env.VITE_API_URL}/salesOrders`;
    try {
        const response = await fetch(BASE_URL, {
            method: 'DELETE',
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(salesOrderData),
        });

        if (response.status === 401) {
            await destroyStoresAndLogout();
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