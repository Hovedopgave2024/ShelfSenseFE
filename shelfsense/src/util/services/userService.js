import { getRequest } from './getRequestService.js';

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
        const user = await response.json();
        console.log(user);
        return user;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const validateSession = async () => {
    return await getRequest(`session`)
}