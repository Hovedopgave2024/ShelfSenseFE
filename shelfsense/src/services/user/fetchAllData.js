import useSessionStore from "../../stores/useSessionStore.js";
import {getRequest} from "../getRequestService.js";
import useSnackbarStore from "../../stores/useSnackbarStore.js";

export const fetchAllData = async () => {
    const userId = useSessionStore.getState().user?.id;
    const showSnackbar = useSnackbarStore.getState().showSnackbar;

    if (!userId) {
        showSnackbar("error", "User ID is missing. Please logout and login again.");
        return null;
    }

    try {
        const userData = await getRequest(`users/${userId}`);

        if (!userData) {
            showSnackbar("error", "Error while fetching user data. Please logout and login again or contact Support.");
            return null;
        }

        return {
            components: userData.componentList || [],
            products: userData.productList || [],
            salesOrders: userData.salesOrderList || [],
            apiUpdate: userData.apiUpdate || null,
        };

    } catch (error) {
        console.error("Error while fetching all data:", error);
        showSnackbar("error", "Error while fetching user data. Please logout and login again or contact Support.");
        return null;
    }
};