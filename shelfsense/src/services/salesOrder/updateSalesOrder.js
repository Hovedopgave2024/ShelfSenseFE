import {destroyStoresAndLogout} from "../../util/user/destroyStoresAndLogout.js";

export const updateSalesOrder = async (salesOrderData) => {
    const BASE_URL = `${import.meta.env.VITE_API_URL}/salesOrders`;
    try {
        const response = await fetch(BASE_URL, {
            method: 'PUT',
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(salesOrderData),
        });

        if (response.status === 401) {
            await destroyStoresAndLogout();
            return null;
        }

        if (!response.ok) {
            console.error('Failed to update sales order:', response.status);
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error('Error while updating sales order:', error);
        return null;
    }
};