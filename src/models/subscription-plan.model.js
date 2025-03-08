import mongoose from 'mongoose';

const subscriptionPlanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Plan name is required'],
    unique: true,
    trim: true
  },
  tier: {
    type: String,
    enum: ['free', 'basic', 'premium', 'enterprise'],
    default: 'basic'
  },
  description: {
    type: String,
    required: [true, 'Plan description is required']
  },
  price: {
    type: Number,
    required: [true, 'Plan price is required'],
    min: [0, 'Price cannot be negative']
  },
  taskLimit: {
    type: Number,
    default: -1 // -1 = unlimited
  },
  teamSizeLimit: {
    type: Number,
    default: 1
  },
  trialDays: {
    type: Number,
    default: 0,
    min: [0, 'Trial days cannot be negative']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

export default mongoose.model('SubscriptionPlan', subscriptionPlanSchema);