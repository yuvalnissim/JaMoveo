import { useState } from "react";
import { registerUser } from "../api";
import { useNavigate } from "react-router-dom";

const AdminSignup = () => {
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
            await registerUser({ ...formData, isAdmin: true }); // ✅ נשלח isAdmin=true
            alert("Admin registration successful!");
            navigate("/login");
        } catch (error) {
            alert("Error: " + error.response?.data?.message || "Something went wrong");
        }
    };

    return (
        <div className="signup-container">
            <h2>🔑 Admin Signup</h2>
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
                <button type="submit">Register as Admin</button>
            </form>
        </div>
    );
};

export default AdminSignup;
