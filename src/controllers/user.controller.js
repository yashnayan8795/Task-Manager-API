import User from '../models/User.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import asyncWrapper from '../utils/asyncWrapper.js';

// User Registration
export const register = async (req, res) => {
  const { name, email, password, username } = req.body;

  try {
    // Check if user exists
    let user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      return res.status(400).json({ error: "User with this email/username already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({ name, email, password: hashedPassword, username });
    await user.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    res.status(500).json({ error: "Something went wrong!" });
  }
};

// User Login
export const login = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Generate Access Token (1h expiry)
    const accessToken = jwt.sign(
      { user: { id: user.id } },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Generate Refresh Token (7d expiry)
    const refreshToken = jwt.sign(
      { user: { id: user.id } },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    // Save refreshToken to the database
    try {
         user.refreshToken = refreshToken;
         await user.save();
       } catch (saveErr) {
         return res.status(500).json({ error: "Failed to save refresh token" });
       }

    // Store refreshToken in an HTTP-only cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    
    res.json({ accessToken });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get All Users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().exec();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Something went wrong!" });
  }
};

// Get User by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).exec();
    if (!user) return res.status(404).json({ error: "User not found" });

    // Authorization check
    if (req.user.id !== user.id && req.user.role !== "admin") {
      return res.status(403).json({ error: "Unauthorized" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Something went wrong!" });
  }
};

// Refresh Token
export const refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(401).json({ error: "No refresh token" });

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.user.id);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ error: "Invalid refresh token" });
    }

    // Generate new access token
    const newAccessToken = jwt.sign(
      { user: { id: user.id } },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ accessToken: newAccessToken });
  } catch (err) {
    res.status(403).json({ error: "Invalid token" });
  }
};
