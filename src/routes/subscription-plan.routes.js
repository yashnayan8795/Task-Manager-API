import { Router } from 'express';
import {
  createPlan,
  getPlans,
  updatePlan,
  deletePlan
} from '../controllers/subscription-plan.controller.js';
import authorize from '../middleware/authorize.middleware.js';

const router = Router();

// Admin-only routes
router.use(authorize(['admin']));

router.post('/', createPlan);
router.get('/', getPlans);
router.put('/:id', updatePlan);
router.delete('/:id', deletePlan);

export default router;