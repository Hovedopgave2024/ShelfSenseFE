import {destroyStoresAndLogout} from "../../util/user/destroyStoresAndLogout.js";

export const createSalesOrder = async (salesOrderData) => {
    const BASE_URL = `${import.meta.env.VITE_API_URL}/salesOrders`;

    try {
        const response = await fetch(BASE_URL, {
            method: "POST",
            headers: {"Content-Type": "application/json",},
            credentials: "include",
            body: JSON.stringify({
                quantity: parseInt(salesOrderData.quantity, 10),
                price: parseFloat(salesOrderData.price),
                createdDate: salesOrderData.createdDate,
                productId: parseInt(salesOrderData.productId, 10),
            }),
        });

        if (response.status === 401) {
            await destroyStoresAndLogout();
            return null;
        }

        if (!response.ok) {
            console.error('Failed to create sales order:', response.status);
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error('Error occurred while creating sales order:', error);
        return null;
    }
};