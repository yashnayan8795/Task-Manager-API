import express from 'express';
import { 
  createTask, 
  getAllTasks, 
  getTaskById, 
  updateTask, 
  deleteTask,
  updateTaskStatus 
} from '../controllers/task.controller.js';
import { validateTask } from '../middleware/validateTask.middleware.js';
import { checkTaskOwnership } from '../middleware/checkTaskOwnership.middleware.js';
import auth from '../middleware/auth.middleware.js';

const router = express.Router();

router.post("/", auth, validateTask, createTask);
router.get("/", auth, getAllTasks);
router.get("/:id", auth, checkTaskOwnership, getTaskById);
router.put("/:id", auth, checkTaskOwnership, validateTask, updateTask);
router.delete("/:id", auth, checkTaskOwnership, deleteTask);
router.patch("/:id/status", auth, checkTaskOwnership, updateTaskStatus);

export default router;