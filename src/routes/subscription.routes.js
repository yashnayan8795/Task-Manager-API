import { Router } from 'express';
import {
  createSubscription,
  getMySubscriptions,
  cancelSubscription
} from '../controllers/subscription.controller.js';
import auth from '../middleware/auth.middleware.js';

const router = Router();

router.use(auth);

router.post('/', createSubscription);
router.get('/me', getMySubscriptions);
router.patch('/:id/cancel', cancelSubscription);

export default router;