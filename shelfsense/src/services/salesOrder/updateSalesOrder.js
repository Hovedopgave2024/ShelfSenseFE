import {clearStoresAndLogout} from "../../util/user/clearStoresAndLogout.js";

export const updateSalesOrder = async (salesOrderData) => {
    const BASE_URL = `${import.meta.env.VITE_API_URL}/salesOrders`;
    try {
        const response = await fetch(BASE_URL, {
            method: 'PUT',
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(
                {
                    id: parseInt(salesOrderData.id, 10),
                    createdDate: salesOrderData.createdDate,
                    price: parseFloat(salesOrderData.price),
                    productId: parseInt(salesOrderData.productId, 10),
                    quantity: parseInt(salesOrderData.quantity, 10),
                    productName: salesOrderData.productName,
                }
            ),
        });

        if (response.status === 401) {
            await clearStoresAndLogout();
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