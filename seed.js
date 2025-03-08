import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Task from './src/models/task.model.js';
import User from './src/models/User.model.js';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import path from 'path';
import bcrypt from 'bcryptjs'; // For password hashing

// Load environment variables based on NODE_ENV
const envPath = `.env.${process.env.NODE_ENV || 'development'}`;
dotenv.config({ path: envPath });

console.log('Loading environment from:', envPath); // Debug log

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Validate environment variables
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('❌ MONGO_URI is not defined in environment variables');
  process.exit(1);
}

// Database connection with retry logic
const connectWithRetry = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.error(`❌ Connection failed: ${err.message}`);
    console.log('Retrying connection in 5 seconds...');
    setTimeout(connectWithRetry, 5000);
  }
};

const seedDatabase = async () => {
  try {
    await connectWithRetry();
    
    // Clean existing data
    console.log('🧹 Cleaning existing tasks...');
    await Task.deleteMany();

    // Find or create sample user
    const sampleEmail = 'nayanyash693@gmail.com';
    let sampleUser = await User.findOne({ email: sampleEmail });

    if (!sampleUser) {
      // Create sample user if not found
      const hashedPassword = await bcrypt.hash('123456789', 10); // Hash the password
      sampleUser = await User.create({
        name: 'Yash Nayan',
        email: sampleEmail,
        password: hashedPassword,
        username: 'yashnayan8795',
        role: 'admin'
      });
      console.log('✅ Created sample user');
    }

    // Load and transform tasks
    const tasksPath = path.join(__dirname, 'tasks.json');
    const rawData = await fs.readFile(tasksPath, 'utf-8');
    const tasksData = JSON.parse(rawData);

    const transformedTasks = tasksData.map(task => ({
      ...task,
      user: sampleUser._id, // Associate tasks with the sample user
      status: task.status || 'not-started',
      category: task.category || 'General',
      dueDate: task.dueDate ? new Date(task.dueDate) : null,
    }));

    // Insert new tasks
    const result = await Task.insertMany(transformedTasks);
    console.log(`✅ Successfully seeded ${result.length} tasks`);

    // Close connection
    await mongoose.disconnect();
    console.log('🔌 MongoDB connection closed');
    process.exit(0);

  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seedDatabase();