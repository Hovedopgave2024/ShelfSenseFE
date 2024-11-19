import { getRequest } from './getRequestService.js';
import useProductsStore from '../../stores/useProductsStore.js';
import useComponentsStore from '../../stores/useComponentsStore';
import useSalesOrdersStore from '../../stores/useSalesOrdersStore';

export const login = async (name, password) => {

    const LOGIN_URL = `${import.meta.env.VITE_API_URL}/login`;

    try {
        const response = await fetch(LOGIN_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ name, password }),
        });

        if (!response.ok) {
            console.error('Login failed:', response.statusText);
            return;
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const fetchData = async () => {
    const userData = await getRequest(`users`)
    const products = userData.productList ? JSON.parse(JSON.stringify(userData.productList)) : [];
    const components = userData.componentList ? JSON.parse(JSON.stringify(userData.componentList)) : [];
    const salesOrders = userData.salesOrderList ? JSON.parse(JSON.stringify(userData.salesOrderList)) : [];

    useProductsStore.getState().setProducts(products);
    useComponentsStore.getState().setComponents(components);
    useSalesOrdersStore.getState().setSalesOrders(salesOrders);

}

export const validateSession = async () => {
    return await getRequest(`session`)
}