import Task from "../models/task.model.js";

export const checkTaskOwnership = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });

    if (task.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ error: "Not authorized" });
    }

    req.task = task;
    next();
  } catch (error) {
    return res.status(400).json({ error: "Invalid Task ID" });
  }
};