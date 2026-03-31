import { Router } from 'express';
import * as camisetasController from '../controllers/camisetas.controller.js';

const router = Router();

router.get("/", camisetasController.getAll);
router.get("/:id", camisetasController.getById);

export default router;