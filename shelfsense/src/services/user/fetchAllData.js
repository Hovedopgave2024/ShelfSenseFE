import useSessionStore from "../../stores/useSessionStore.js";
import {getRequest} from "../GetRequestService.jsx";
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

    const products = userData.productList ? JSON.parse(JSON.stringify(userData.productList)) : [];
    const components = userData.componentList ? JSON.parse(JSON.stringify(userData.componentList)) : [];
    const salesOrders = userData.salesOrderList ? JSON.parse(JSON.stringify(userData.salesOrderList)) : [];
    const apiUpdate = userData.apiUpdate ? JSON.parse(JSON.stringify(userData.apiUpdate)) : null;

    const productMap = products.reduce((acc, product) => {
        acc[product.id] = product.name; // Assuming each product has an `id` and `name`
        return acc;
    }, {});

    // Enrich sales orders with productName
    const enrichedSalesOrders = salesOrders.map((salesOrder) => ({
        ...salesOrder,
        productName: productMap[salesOrder.productId] || "Unknown Product",
    }));

    useProductsStore.getState().setProducts(products);
    useComponentsStore.getState().setComponents(components);
    useSalesOrdersStore.getState().setSalesOrders(enrichedSalesOrders);
    useApiUpdateStore.getState().setApiUpdate(apiUpdate);
}