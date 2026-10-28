import { Router } from 'express';
import { createMove, deleteMove, getMoveById, getMoves, updateMove } from '../controllers/movesController';

const router = Router();
router.get('/', getMoves);
router.get('/:id', getMoveById);
router.post('/', createMove);
router.put('/:id', updateMove);
router.delete('/:id', deleteMove);
export default router;
