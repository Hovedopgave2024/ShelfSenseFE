import { getRequest } from './GetRequestService.jsx';


const BASE_URL = `${import.meta.env.VITE_API_URL}/salesorders`;

export const fetchSalesOrders = async () => {
    return await getRequest(`salesorders`);
};
