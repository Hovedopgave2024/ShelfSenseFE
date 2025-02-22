import {clearStoresAndLogout} from "../../util/user/clearStoresAndLogout.js";
import calculateStatus from "../../util/component/calculateStockStatus.js";

export const updateComponent = async (id, updatedData) => {
    const BASE_URL = `${import.meta.env.VITE_API_URL}/components/${id}`;

    try {
        const response = await fetch(BASE_URL, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
                body: JSON.stringify({
                    name: updatedData.name,
                    type: updatedData.type,
                    footprint: updatedData.footprint,
                    price: updatedData.price,
                    stock: updatedData.stock,
                    safetyStock: updatedData.safetyStock,
                    safetyStockRop: updatedData.safetyStockRop,
                    designator: updatedData.designator,
                    stockStatus: calculateStatus(
                        parseInt(updatedData.stock),
                        parseInt(updatedData.safetyStock),
                        parseInt(updatedData.safetyStockRop)
                    ),
                    supplier: {
                        name: updatedData.supplier,
                        manufacturer: updatedData.manufacturer,
                        manufacturerPart: updatedData.manufacturerPart,
                        safetyStock: updatedData.supplierSafetyStock,
                        safetyStockRop: updatedData.supplierSafetyStockRop,
                        supplierPart: updatedData.supplierPart,
                        supplierStockStatus: updatedData.supplierStock != null
                            ? calculateStatus(
                                parseInt(updatedData.supplierStock),
                                parseInt(updatedData.supplierSafetyStock),
                                parseInt(updatedData.supplierSafetyStockRop)
                            )
                            : null
                    }
                })
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