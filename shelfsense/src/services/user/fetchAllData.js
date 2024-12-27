import useSessionStore from "../../stores/useSessionStore.js";
import {getRequest} from "../getRequestService.js";
import useSnackbarStore from "../../stores/useSnackbarStore.js";
import useProductsStore from "../../stores/useProductsStore.js";
import useComponentsStore from "../../stores/useComponentsStore.js";
import useSalesOrdersStore from "../../stores/useSalesOrdersStore.js";
import useApiUpdateStore from "../../stores/useApiUpdateStore.js";

export const fetchAllData = async () => {
    const userId = useSessionStore.getState().user?.id;
    const showSnackbar = useSnackbarStore.getState().showSnackbar;

    if (!userId) {
        showSnackbar("error", "User ID is missing. Please logout and login again.");
        return false; // Return false if user ID is missing
    }

    try {
        const userData = await getRequest(`users/${userId}`);

        const products = userData.productList ? [...userData.productList] : [];
        const components = userData.componentList ? [...userData.componentList] : [];
        const salesOrders = userData.salesOrderList ? [...userData.salesOrderList] : [];
        const apiUpdate = userData.apiUpdate || null;

        useProductsStore.getState().setProducts(products);
        useComponentsStore.getState().setComponents(components);
        useSalesOrdersStore.getState().setSalesOrders(salesOrders);
        useApiUpdateStore.getState().setApiUpdate(apiUpdate);

        if (!userData) {
            showSnackbar("error", "Error while fetching user data. Please logout and login again or contact Support.");
            return false;
        }

        return true;

    } catch (error) {
        console.error("Error while fetching all data:", error);
        showSnackbar("error", "Unexpected error occurred while fetching data. Please try again later.");
        return false;
    }
};