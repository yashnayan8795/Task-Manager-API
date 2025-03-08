import express from 'express';
import { 
  register, 
  login, 
  getAllUsers, 
  getUserById,
  refreshToken
} from '../controllers/user.controller.js';
import auth from '../middleware/auth.middleware.js';
import authorize from '../middleware/authorize.middleware.js';
import { validateUser } from '../middleware/validateUser.middleware.js';

const router = express.Router();

// Public Routes
router.post("/register", validateUser, register);
router.post("/login", login);

// Admin Routes (Only Admins Can View All Users)
router.get("/", auth, authorize(["admin"]), getAllUsers);

// User Routes (Users Can Access Their Own Profile)
router.get("/:id", auth, getUserById);
router.post("/refresh-token", refreshToken);

export default router;