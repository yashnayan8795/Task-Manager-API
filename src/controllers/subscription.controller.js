import Subscription from '../models/subscription.model.js';
import asyncWrapper from '../utils/asyncWrapper.js';
import SubscriptionPlan from '../models/subscription-plan.model.js';

export const createSubscription = asyncWrapper(async (req, res) => {
  const plan = await SubscriptionPlan.findById(req.body.plan);
  if (!plan) return res.status(400).json({ error: 'Invalid plan' });

  const subscription = await Subscription.create({
    user: req.user.id,
    plan: req.body.plan,
    paymentMethod: req.body.paymentMethod,
    trialEndDate: plan.trialDays > 0 ? 
      new Date(Date.now() + plan.trialDays * 86400000) : null,
    status: plan.trialDays > 0 ? 'trial' : 'active'
  });

  res.status(201).json({ success: true, data: subscription });
});

export const getMySubscriptions = asyncWrapper(async (req, res) => {
  const subscriptions = await Subscription.find({ user: req.user.id })
    .populate('plan');
  res.status(200).json({ success: true, data: subscriptions });
});

export const cancelSubscription = asyncWrapper(async (req, res) => {
  const subscription = await Subscription.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    { status: 'canceled' },
    { new: true }
  );
  if (!subscription) return res.status(404).json({ error: 'Subscription not found' });
  res.status(200).json({ success: true, data: subscription });
});