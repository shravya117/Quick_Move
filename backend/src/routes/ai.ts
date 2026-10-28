import { Router } from 'express';
import { parseOperationsMessage } from '../controllers/aiController';

const router = Router();
router.post('/parse-message', parseOperationsMessage);
export default router;
