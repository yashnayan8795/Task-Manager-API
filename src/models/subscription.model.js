import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  plan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubscriptionPlan',
    required: true
  },
  startDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  renewalDate: Date,
  status: {
    type: String,
    enum: ['active', 'canceled', 'expired', 'trial'],
    default: 'active'
  },
  trialEndDate: Date,
  paymentMethod: {
    type: String,
    required: true
  },
  taskCount: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

export default mongoose.model('Subscription', subscriptionSchema);