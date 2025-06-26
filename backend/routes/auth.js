const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
	return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Register admin user (for initial setup)
router.post("/register", async (req, res) => {
	try {
		const { username, email, password } = req.body;

		// Check if user already exists
		const existingUser = await User.findOne({
			$or: [{ email }, { username }],
		});

		if (existingUser) {
			return res.status(400).json({
				error: "User with this email or username already exists",
			});
		}

		// Create new user
		const user = new User({
			username,
			email,
			password,
			role: "admin",
		});

		await user.save();

		// Generate token
		const token = generateToken(user._id);

		res.status(201).json({
			message: "Admin user created successfully",
			token,
			user: {
				id: user._id,
				username: user.username,
				email: user.email,
				role: user.role,
			},
		});
	} catch (error) {
		res.status(500).json({
			error: "Error creating user",
			details: error.message,
		});
	}
});

// Login
router.post("/login", async (req, res) => {
	try {
		const { username, password } = req.body;

		// Find user by username or email
		const user = await User.findOne({
			$or: [{ username }, { email: username }],
			isActive: true,
		});

		if (!user) {
			return res.status(401).json({ error: "Invalid credentials" });
		}

		// Check password
		const isPasswordValid = await user.comparePassword(password);
		if (!isPasswordValid) {
			return res.status(401).json({ error: "Invalid credentials" });
		}

		// Generate token
		const token = generateToken(user._id);

		res.json({
			message: "Login successful",
			token,
			user: {
				id: user._id,
				username: user.username,
				email: user.email,
				role: user.role,
			},
		});
	} catch (error) {
		res.status(500).json({
			error: "Login error",
			details: error.message,
		});
	}
});

// Verify token and get user info
router.get("/me", authenticateToken, (req, res) => {
	res.json({
		user: {
			id: req.user._id,
			username: req.user.username,
			email: req.user.email,
			role: req.user.role,
		},
	});
});

// Logout (client-side will remove token)
router.post("/logout", authenticateToken, (req, res) => {
	res.json({ message: "Logged out successfully" });
});

module.exports = router;
