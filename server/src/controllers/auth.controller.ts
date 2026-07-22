import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { PrismaClient } from '../../generated/prisma/client';
import { createResponse } from '../utils/api-response.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;
const SALT_ROUNDS = 10;

export const registerController = (prisma: PrismaClient) => async (req: Request, res: Response) => {
    try{
        const { name, email, password } = req.body;

        if (!name || typeof name !== 'string' || name.trim().length === 0) {
        return res.status(400).json(createResponse(false, 'Name is required', null));
        }

        if (!email || typeof email !== 'string') {
        return res.status(400).json(createResponse(false, 'Email is required', null));
        }
        if (!EMAIL_REGEX.test(email)) {
        return res.status(400).json(createResponse(false, 'Email format is invalid', null));
        }

        if (!password || typeof password !== 'string') {
        return res.status(400).json(createResponse(false, 'Password is required', null));
        }
        if (password.length < MIN_PASSWORD_LENGTH) {
        return res
            .status(400)
            .json(createResponse(false, `Password must be at least ${MIN_PASSWORD_LENGTH} characters`, null));
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
        return res.status(400).json(createResponse(false, 'User with this email already exists', null));
        }
        
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        const user = await prisma.user.create({
        data: { name: name.trim(), email, password: hashedPassword },
        });

        const { password: _password, ...safeUser } = user;

        return res.status(201).json(createResponse(true, 'User registered successfully', safeUser));
    }catch (error) {
        console.error('Error in registerController:', error);
        res.status(500).json(createResponse(false, 'Internal server error', null));
    }
}
