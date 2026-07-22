import {Router} from 'express';
import { prisma } from '../config/prisma';
import { registerController, loginController } from '../controllers/auth.controller';

const router = Router();

router.route('/register').post(registerController(prisma));
router.route('/login').post(loginController(prisma));

export default router;
