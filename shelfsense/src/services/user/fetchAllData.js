import useSessionStore from "../../stores/useSessionStore.js";
import {getRequest} from "../getRequestService.js";
import useSnackbarStore from "../../stores/useSnackbarStore.js";
import useProductsStore from "../../stores/useProductsStore.js";
import useComponentsStore from "../../stores/useComponentsStore.js";
import useSalesOrdersStore from "../../stores/useSalesOrdersStore.js";
import useApiUpdateStore from "../../stores/useApiUpdateStore.js";

export const fetchAllData = async () => {
    const userId = useSessionStore.getState().user.id;
    const userData = await getRequest(`users/${userId}`)
    const showSnackbar = useSnackbarStore.getState().showSnackbar;

    if (!userData) {
        showSnackbar("error", "error while fetching user data. Please logout and login again or contact Support");
    }

    const products = userData?.productList ? JSON.parse(JSON.stringify(userData.productList)) : [];
    const components = userData?.componentList ? JSON.parse(JSON.stringify(userData.componentList)) : [];
    const salesOrders = userData?.salesOrderList ? JSON.parse(JSON.stringify(userData.salesOrderList)) : [];
    const apiUpdate = userData?.apiUpdate ? JSON.parse(JSON.stringify(userData.apiUpdate)) : null;

    useProductsStore.getState().setProducts(products);
    useComponentsStore.getState().setComponents(components);
    useSalesOrdersStore.getState().setSalesOrders(salesOrders);
    useApiUpdateStore.getState().setApiUpdate(apiUpdate);
}