import {clearStoresAndLogout} from "../../util/user/clearStoresAndLogout.js";
import calculateStatus from "../../util/component/calculateStockStatus.js";


export const createComponent = async (componentData) => {

    const BASE_URL = `${import.meta.env.VITE_API_URL}/components`;
    try {
        const verifiedSupplier =
            componentData.supplier && Object.keys(componentData.supplier).length > 0
                ? { ...componentData.supplier, stockStatus: calculateStatus(
                        parseInt(componentData.supplier.stock),
                        parseInt(componentData.supplier.safetyStock),
                        parseInt(componentData.supplier.safetyStockRop)
                    ), }
                : null;

        const verifiedOptionalComponentFields =
            componentData.optionalComponentFields && componentData.optionalComponentFields.length > 0
                ? componentData.optionalComponentFields
                : null;

        const response = await fetch(BASE_URL, {
            method: "POST",
            headers: {"Content-Type": "application/json",},
            credentials: "include",
            body: JSON.stringify({
                name: componentData.name,
                price: componentData.price,
                stock: componentData.stock,
                safetyStock: componentData.safetyStock,
                safetyStockRop: componentData.safetyStockRop,
                stockStatus: calculateStatus(
                    parseInt(componentData.stock),
                    parseInt(componentData.safetyStock),
                    parseInt(componentData.safetyStockRop)
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
            console.error('Failed to create component:', response.status);
            return null;
        }
        return await response.json();
    } catch (error) {
        console.error('Error occurred while creating component:', error);
        return null;
    }
};