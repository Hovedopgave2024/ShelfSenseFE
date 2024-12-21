import {getRequest} from "../getRequestService.js";

export const validateSession = async () => {
    return await getRequest(`session`)
}