import axios from "axios";

const API_URL = "jamoveo-production-d468.up.railway.app";

// ✅ רישום משתמש (כולל isAdmin)
export async function registerUser(userData) {
    try {
        const response = await axios.post(`${API_URL}/signup`, userData);
        return response.data;
    } catch (error) {
        console.error("❌ Error during signup:", error.response?.data || error.message);
        throw error;
    }
}

// ✅ התחברות משתמש
export async function loginUser(userData) {
    try {
        const response = await axios.post(`${API_URL}/login`, userData, {
            headers: { "Content-Type": "application/json" }
        });
        return response;
    } catch (error) {
        console.error("❌ Error during login:", error.response?.data || error.message);
        throw error;
    }
}
