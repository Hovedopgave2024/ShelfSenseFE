import {clearStoresAndLogout} from "../../util/user/clearStoresAndLogout.js";
import calculateStatus from "../../util/component/calculateStockStatus.js";

export const updateComponent = async (id, updatedData) => {
    const BASE_URL = `${import.meta.env.VITE_API_URL}/components/${id}`;

    try {

        const verifiedSupplier =
            updatedData.supplier && Object.keys(updatedData.supplier).length > 0
                ? { ...updatedData.supplier, stockStatus: calculateStatus(
                        parseInt(updatedData.supplier.stock),
                        parseInt(updatedData.supplier.safetyStock),
                        parseInt(updatedData.supplier.safetyStockRop)
                    ), }
                : null;

        const verifiedOptionalComponentFields =
            updatedData.optionalComponentFields && updatedData.optionalComponentFields.length > 0
                ? updatedData.optionalComponentFields
                : null;


        const response = await fetch(BASE_URL, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
                name: updatedData.name,
                price: updatedData.price,
                stock: updatedData.stock,
                safetyStock: updatedData.safetyStock,
                safetyStockRop: updatedData.safetyStockRop,
                stockStatus: calculateStatus(
                    parseInt(updatedData.stock),
                    parseInt(updatedData.safetyStock),
                    parseInt(updatedData.safetyStockRop)
                ),
                supplier: verifiedSupplier,
                optionalComponentFields: verifiedOptionalComponentFields
            })
        });
        if (response.status === 401) {
            await clearStoresAndLogout();
            return null;
        }

        if (!response.ok) {
            console.error('Failed to update component:', response.status);
            return null;
        }
        return await response.json();
    } catch (error) {
        console.error('Error updating component:', error);
        return null;
    }
};