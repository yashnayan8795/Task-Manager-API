import SubscriptionPlan from '../models/subscription-plan.model.js';
import asyncWrapper from '../utils/asyncWrapper.js';

export const createPlan = asyncWrapper(async (req, res) => {
  const plan = await SubscriptionPlan.create(req.body);
  res.status(201).json({ success: true, data: plan });
});

export const getPlans = asyncWrapper(async (req, res) => {
  const plans = await SubscriptionPlan.find({ isActive: true });
  res.status(200).json({ success: true, data: plans });
});

export const updatePlan = asyncWrapper(async (req, res) => {
  const plan = await SubscriptionPlan.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  if (!plan) return res.status(404).json({ success: false, error: 'Plan not found' });
  res.status(200).json({ success: true, data: plan });
});

export const deletePlan = asyncWrapper(async (req, res) => {
  const plan = await SubscriptionPlan.findByIdAndDelete(req.params.id);
  if (!plan) return res.status(404).json({ success: false, error: 'Plan not found' });
  res.status(200).json({ success: true, message: 'Plan deleted successfully' });
});