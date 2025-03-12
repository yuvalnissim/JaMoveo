const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // כתובת ה-Frontend
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI)


.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

// User Schema
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    instrument: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
});

const User = mongoose.model('User', UserSchema);

// Auth Routes
app.post('/signup', async (req, res) => {
    try {
        console.log("Received signup request:", req.body); // ✅ הדפסת הנתונים שמתקבלים

        const { username, password, instrument, isAdmin } = req.body;

        if (!username || !password || !instrument) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: "Username already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword, instrument, isAdmin });

        await user.save();
        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ error: "Error creating user" });
    }
});



app.post('/login', async (req, res) => {
    try {
        console.log("🔹 Received login request:", req.body); // 🔍 נבדוק מה מתקבל מה-Frontend

        const { username, password } = req.body;
        if (!username || !password) {
            console.log("❌ Missing username or password");
            return res.status(400).json({ error: "Both username and password are required" });
        }

        const user = await User.findOne({ username });
        if (!user) {
            console.log("❌ User not found");
            return res.status(400).json({ error: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("❌ Invalid credentials");
            return res.status(400).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign({ userId: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: '1h' });

        console.log("✅ Login successful for user:", user.username);
        res.json({ token, isAdmin: user.isAdmin, instrument: user.instrument });

    } catch (error) {
        console.error("❌ Error during login:", error);
        res.status(500).json({ error: "Server error" });
    }
});




// Socket.io Connection
io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("songSelected", (song) => {
        io.emit("songSelected", song);
    });

    socket.on("sessionEnded", () => {
        io.emit("sessionEnded");
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

// Basic Routes
app.get('/', (req, res) => {
    res.send('JaMoveo Backend is Running');
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
