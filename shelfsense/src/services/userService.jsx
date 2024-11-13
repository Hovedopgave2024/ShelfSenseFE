const LOGIN_URL = `${import.meta.env.VITE_API_URL}/login`;

export const login = async (name, password) => {
    try {
        const response = await fetch(LOGIN_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, password }),
        });

        if (!response.ok) {
            return { success: false, message: "Invalid username or password" };
        }
        return { success: true, message: "Login successful" };
    } catch (error) {
        console.error(error);
        return { success: false, message: "An error occurred. Please try again." };
    }
};