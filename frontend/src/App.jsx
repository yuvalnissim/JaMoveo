import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Signup from "./components/Signup";
import AdminSignup from "./components/AdminSignup"; // ✅ ייבוא העמוד החדש
import Login from "./components/Login";
import AdminMain from "./pages/AdminMain";
import PlayerMain from "./pages/PlayerMain";

const App = () => {
    return (
        <div>
            <nav>
                <Link to="/">Home</Link> | 
                <Link to="/signup">Signup</Link> | 
                <Link to="/admin-signup">Admin Signup</Link> | {/* ✅ לינק חדש */}
                <Link to="/login">Login</Link> | 
                <Link to="/admin">Admin</Link> | 
                <Link to="/player">Player</Link>
            </nav>

            <Routes>
                <Route path="/" element={<h1>Welcome to JaMoveo!</h1>} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/admin-signup" element={<AdminSignup />} /> {/* ✅ רישום אדמין */}
                <Route path="/login" element={<Login />} />
                <Route path="/admin" element={<AdminMain />} />
                <Route path="/player" element={<PlayerMain />} />
            </Routes>
        </div>
    );
};

export default App;
