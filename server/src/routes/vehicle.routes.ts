import { Router } from 'express';
import { createVehicleController, getVehiclesController, searchVehiclesController } from '../controllers/vehicle.controller.js';
import { prisma } from '../config/prisma.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

router.route('/').post(authMiddleware, createVehicleController(prisma))
router.route('/').get(authMiddleware, getVehiclesController(prisma))
router.route('/search').get(authMiddleware, searchVehiclesController(prisma))

export default router;