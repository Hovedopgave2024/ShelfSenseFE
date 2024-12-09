import {getRequest} from "../GetRequestService.jsx";

export const validateSession = async () => {
    return await getRequest(`session`)
}