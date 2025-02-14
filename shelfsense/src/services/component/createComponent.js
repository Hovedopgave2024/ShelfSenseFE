import {clearStoresAndLogout} from "../../util/user/clearStoresAndLogout.js";
import calculateStatus from "../../util/component/calculateStockStatus.js";


export const createComponent = async (componentData) => {

    const BASE_URL = `${import.meta.env.VITE_API_URL}/components`;
    try {

        console.log("stock:", componentData.stock);
        console.log("safetyStock:", componentData.safetyStock);
        console.log("safetyStockRop:", componentData.safetyStockRop);
        console.log("Calculated Stock Status:", calculateStatus(parseInt(componentData.stock), parseInt(componentData.safetyStock), parseInt(componentData.safetyStockRop)));

        const response = await fetch(BASE_URL, {
            method: "POST",
            headers: {"Content-Type": "application/json",},
            credentials: "include",
            body: JSON.stringify({
                ...componentData,
                stockStatus: calculateStatus(parseInt(componentData.stock), parseInt(componentData.safetyStock), parseInt(componentData.safetyStockRop)),
                supplierStockStatus: null
            }),
        });

        if (response.status === 401) {
            await clearStoresAndLogout();
            return null;
        }

        if (!response.ok) {
            console.error('Failed to create component:', response.status);
            return null;
        }
        const jResponse = await response.json();
        console.log(jResponse);
        return jResponse;
    } catch (error) {
        console.error('Error occurred while creating component:', error);
        return null;
    }
};