import Task from "../models/task.model.js";
import asyncWrapper from "../utils/asyncWrapper.js";

// Create a new task
export const createTask = asyncWrapper(async (req, res) => {
  console.log("user in request", req.user);
  if (!req.user || !req.user.id) {
    return res.status(401).json({ error: "Unauthorized: No user found in request" });
  }
  const task = new Task({
    ...req.body,
    user: req.user.id // Assign the task to the user who created it
  });

  await task.save();
  res.status(201).json(task);
});

// Get all tasks
export const getAllTasks = asyncWrapper(
  async (req, res) => {
  let query = req.user.role === "admin" ? {} : { user: req.user.id };

  if (req.query.status) {
    query.status = req.query.status;
  }

  if (req.query.title) {
    query.title = { $regex: req.query.title, $options: "i" };
  }

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const tasks = await Task.find(query).skip(skip).limit(limit).exec();
  const totalTasks = await Task.countDocuments(query).exec();

  res.json({
    page,
    totalPages: Math.ceil(totalTasks / limit),
    totalTasks,
    tasks,
  });
});

// Get a single task by ID
export const getTaskById = async (req, res) => {
  const task =  req.task || await Task.findById(req.params.id).exec();

  if (!task) return res.status(404).json({ error: "Task not found" });
  
  // Only owner or admin can access the task
  if (task.user.toString() !== req.user.id && req.user.role !== "admin") {
    return res.status(403).json({ error: "Not authorized to view this task" });
  }

  res.json(task);
};

// Update a task
export const updateTask = asyncWrapper(
  async (req, res) => {
  const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true }).exec();
  res.json(updatedTask);
});

// Update task status
export const updateTaskStatus = asyncWrapper(
  async (req, res) => {
  const { status } = req.body;
  const validStatuses = ["not-started", "in-progress", "completed"];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: "Invalid status value" });
  }

  const task = await Task.findById(req.params.id).exec();
  if (!task) return res.status(404).json({ error: "Task not found" });

  // Only owner or admin can update status
  if (task.user.toString() !== req.user.id && req.user.role !== "admin") {
    return res.status(403).json({ error: "Not authorized to update task status" });
  }

  task.status = status;
  await task.save();

  res.json(task);
});

// Delete a task
export const deleteTask = asyncWrapper(
  async (req, res) => {
  const task = await Task.findById(req.params.id).exec();
  if (!task) return res.status(404).json({ error: "Task not found" });

  // Only owner or admin can delete the task
  if (task.user.toString() !== req.user.id && req.user.role !== "admin") {
    return res.status(403).json({ error: "Not authorized to delete this task" });
  }

  await task.deleteOne();
  res.json({ message: "Task deleted successfully" });
});