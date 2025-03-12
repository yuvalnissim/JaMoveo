import { useState } from "react";
import { loginUser } from "../api";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [formData, setFormData] = useState({
        username: "",
        password: ""
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await loginUser(formData);
            console.log("✅ Login successful:", res.data);

            // ✅ שמירת פרטי המשתמש ב- localStorage
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("instrument", res.data.instrument);
            localStorage.setItem("isAdmin", res.data.isAdmin);

            alert("✅ Login successful!");
            
            // ✅ ניתוב לפי תפקיד
            res.data.isAdmin ? navigate("/admin") : navigate("/player");
        } catch (error) {
            console.error("❌ Login error:", error.response?.data || error.message);
            alert("❌ Login failed: " + (error.response?.data?.error || "Unknown error"));
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
                <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
