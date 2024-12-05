import { getRequest } from './GetRequestService.jsx';
import useProductsStore from '../../stores/useProductsStore.js';
import useComponentsStore from '../../stores/useComponentsStore';
import useSalesOrdersStore from '../../stores/useSalesOrdersStore';
import useSessionStore from "../../stores/useSessionStore.js";
import useApiUpdateStore from '../../stores/useApiUpdateStore.js';
import useSnackbarStore from '../../stores/useSnackbarStore';
import {destroyStoresAndLogout} from "../destroyStoresAndLogout.js";

export const login = async (name, password) => {

    const LOGIN_URL = `${import.meta.env.VITE_API_URL}/login`;
    const showSnackbar = useSnackbarStore.getState().showSnackbar;

    try {
        const response = await fetch(LOGIN_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ name, password }),
        });

        if (response.status === 401) {
            showSnackbar('error', 'Username or password is wrong, please try again.');
            console.error("Login failed: ", response);
            return null;
        }
        if (!response.ok) {
            showSnackbar('error', 'Unexpected error. Please try again, check your network connection or contact Support.');
            console.error("Login failed: ", response);
            return null;
        }
        return await response.json();
    } catch (error) {
        showSnackbar('error', 'Network error or server is not responding. Please try again, check your network connection or contact Support.');
        console.error(error);
        return null;
    }
};

export const fetchAllData = async () => {
    const userId = useSessionStore.getState().user.id;
    const userData = await getRequest(`users/${userId}`)
    const showSnackbar = useSnackbarStore.getState().showSnackbar;

    if (!userData) {
        showSnackbar("error", "error while fetching user data");
    }

    const products = userData.productList ? JSON.parse(JSON.stringify(userData.productList)) : [];
    const components = userData.componentList ? JSON.parse(JSON.stringify(userData.componentList)) : [];
    const salesOrders = userData.salesOrderList ? JSON.parse(JSON.stringify(userData.salesOrderList)) : [];
    const apiUpdate = userData.apiUpdate ? JSON.parse(JSON.stringify(userData.apiUpdate)) : null;

    useProductsStore.getState().setProducts(products);
    useComponentsStore.getState().setComponents(components);
    useSalesOrdersStore.getState().setSalesOrders(salesOrders);
    useApiUpdateStore.getState().setApiUpdate(apiUpdate);
}

export const validateSession = async () => {
    return await getRequest(`session`)
}

export const updateUser = async (updatedData) => {
    const BASE_URL = `${import.meta.env.VITE_API_URL}/users`;
    const showSnackbar = useSnackbarStore.getState().showSnackbar;

    try {
        const response = await fetch(BASE_URL, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(updatedData),
        });

        if (response.status === 400) {
            showSnackbar("error", "Requirements for updating user were not met (probably wrong old password), please try again.")
            console.error('Failed to update user:', response.status);
            return null;
        }
        if (response.status === 401) {
            await destroyStoresAndLogout();
            return null;
        }

        if (!response.ok) {
            showSnackbar("error", "Failed to update user, please try again or contact Support")
            console.error('Failed to update user:', response.status);
            return null;
        }
        return await response.json();
    } catch (error) {
        console.error('Error updating user:', error);
        return null;
    }
};

export const logout = async () => {
    const LOGOUT_URL = `${import.meta.env.VITE_API_URL}/logout`;
    const showSnackbar = useSnackbarStore.getState().showSnackbar;

    try {
        const response = await fetch(LOGOUT_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        });

        if (!response.ok) {
            showSnackbar('error', 'Server error. Logging out locally. Navigating to login page.');
            console.error('Logout failed on server:', response);
        }

        showSnackbar('success', 'Logout successful. Navigating to login page. See you soon!');
    } catch (error) {
        // Handle network or other fetch-related errors
        showSnackbar('error', 'Network error. Logout successful locally. Navigating to login page.');
        console.error('Logout error:', error);
    } finally {
        // Clear local data regardless of the result
        localStorage.removeItem('apiUpdate-store');
        localStorage.removeItem('components-store');
        localStorage.removeItem('products-store');
        localStorage.removeItem('sales-orders-store');
        localStorage.removeItem('user-session');
        localStorage.removeItem('theme-storage');

        await new Promise((resolve) => setTimeout(resolve, 2000));
    }
};

