import { getRequest } from './getRequestService.js';

export const fetchProducts = async () => {
    return getRequest(`products`);
};