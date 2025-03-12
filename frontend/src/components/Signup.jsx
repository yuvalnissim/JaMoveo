import { useState } from "react";
import { registerUser } from "../api";
import { useNavigate } from "react-router-dom";

const Signup = () => {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        instrument: "guitar",
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // ✅ הוספת isAdmin כברירת מחדל כדי למנוע בעיות
            await registerUser({ ...formData, isAdmin: false });
            alert("✅ Signup successful!");
            navigate("/login");
        } catch (error) {
            console.error("❌ Signup error:", error.response?.data || error.message);
            alert("❌ Signup failed: " + (error.response?.data?.error || "Unknown error"));
        }
    };

    return (
        <div>
            <h2>Signup</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
                <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
                <select name="instrument" onChange={handleChange}>
                    <option value="guitar">Guitar</option>
                    <option value="bass">Bass</option>
                    <option value="drums">Drums</option>
                    <option value="vocals">Vocals</option>
                    <option value="keyboard">Keyboard</option>
                    <option value="saxophone">Saxophone</option>
                </select>
                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
};

export default Signup;
