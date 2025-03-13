import axios from "axios";

const API_URL = "mongodb+srv://yuvalnissim:<db_password>@cluster0.sygao8c.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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
