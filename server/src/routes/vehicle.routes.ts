import { Router } from 'express';
import { createVehicleController, deleteVehicleController, getVehiclesController, purchaseVehicleController, restockVehicleController, searchVehiclesController, updateVehicleController } from '../controllers/vehicle.controller.js';
import { prisma } from '../config/prisma.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { adminMiddleware } from '../middleware/admin.middleware.js';

const router = Router();

router.route('/').post(authMiddleware, createVehicleController(prisma))
router.route('/').get(authMiddleware, getVehiclesController(prisma))
router.route('/search').get(authMiddleware, searchVehiclesController(prisma))
router.route('/:id').put(authMiddleware, updateVehicleController(prisma))
router.route('/:id').delete(authMiddleware, adminMiddleware, deleteVehicleController(prisma))
router.route('/:id/purchase').post(authMiddleware, purchaseVehicleController(prisma))
router.route('/:id/restock').post(authMiddleware, adminMiddleware, restockVehicleController(prisma))


export default router;