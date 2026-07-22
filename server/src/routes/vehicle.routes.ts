import { Router } from 'express';
import { createVehicleController, getVehiclesController } from '../controllers/vehicle.controller.js';
import { prisma } from '../config/prisma.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

router.route('/').post(authMiddleware, createVehicleController(prisma))
router.route('/').get(authMiddleware, getVehiclesController(prisma))

export default router;