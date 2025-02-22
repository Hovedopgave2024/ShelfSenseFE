import {clearStoresAndLogout} from "../../util/user/clearStoresAndLogout.js";
import calculateStatus from "../../util/component/calculateStockStatus.js";


export const createComponent = async (componentData) => {

    const BASE_URL = `${import.meta.env.VITE_API_URL}/components`;
    try {

        const response = await fetch(BASE_URL, {
            method: "POST",
            headers: {"Content-Type": "application/json",},
            credentials: "include",
            body: JSON.stringify({
                name: componentData.name,
                type: componentData.type,
                footprint: componentData.footprint,
                price: componentData.price,
                stock: componentData.stock,
                safetyStock: componentData.safetyStock,
                safetyStockRop: componentData.safetyStockRop,
                designator: componentData.designator,
                stockStatus: calculateStatus(
                    parseInt(componentData.stock),
                    parseInt(componentData.safetyStock),
                    parseInt(componentData.safetyStockRop)
                ),
                supplier: {
                    name: componentData.supplier,
                    manufacturer: componentData.manufacturer,
                    manufacturerPart: componentData.manufacturerPart,
                    safetyStock: componentData.supplierSafetyStock,
                    safetyStockRop: componentData.supplierSafetyStockRop,
                    supplierPart: componentData.supplierPart,
                    stockStatus: null
                }
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