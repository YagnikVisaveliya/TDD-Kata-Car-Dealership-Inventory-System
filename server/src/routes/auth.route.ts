import {Router} from 'express';
import { prisma } from '../config/prisma';
import { registerController } from '../controllers/auth.controller';

const router = Router();

router.route('/register').post(registerController(prisma));

export default router;
