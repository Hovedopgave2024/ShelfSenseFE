import { getRequest } from './getRequestService.js';

export const fetchComponents = async () => {
    return await getRequest(`components`);
};