import { Router } from 'express';
import { createBlocker, deleteBlocker, getBlockers, updateBlocker } from '../controllers/blockersController';

const router = Router();
router.get('/', getBlockers);
router.post('/', createBlocker);
router.put('/:id', updateBlocker);
router.delete('/:id', deleteBlocker);
export default router;
