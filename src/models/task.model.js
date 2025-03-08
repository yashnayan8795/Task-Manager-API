import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String, default: "General" },
  status: { 
    type: String, 
    enum: ["not-started", "in-progress", "completed"], 
    default: "not-started" 
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dueDate: { type: Date },
}, { timestamps: true });

export default mongoose.models.Task || mongoose.model("Task", TaskSchema);