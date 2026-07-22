import { Request, Response} from 'express';
import { PrismaClient } from '../../generated/prisma/client';
import { createResponse } from '../utils/api-response.js';
import { isValidVehicleMake, isValidVehicleQuantity, isValidVehiclePrice, isValidVehicleModel, isValidVehicleCategory } from '../utils/InputValidation';

export const createVehicleController = (prisma: PrismaClient) => async (req: Request, res: Response) => {
    try {
        const { make, model, category, price, quantity } = req.body;
        if(!isValidVehicleMake(make)) {
            return res.status(400).json(createResponse(false, 'Make is required', null));
        }
        if(!isValidVehicleModel(model)) {
            return res.status(400).json(createResponse(false, 'Model is required', null));
        }
        if(!isValidVehicleCategory(category)) {
            return res.status(400).json(createResponse(false, 'Category is required', null));
        }
        if(!isValidVehiclePrice(price)) {
            return res.status(400).json(createResponse(false, 'Valid price is required', null));
        }
        if(!isValidVehicleQuantity(quantity)) {
            return res.status(400).json(createResponse(false, 'Valid quantity is required', null));
        }

        const vehicle = await prisma.vehicle.create({
            data: { 
                make: (make as string).trim(),
                model: (model as string).trim(),
                category: (category as string).trim(),
                price, 
                quantity 
            },
        });

        return res.status(201).json(createResponse(true, 'Vehicle created successfully', vehicle));

    } catch (error) {
        console.error('Error in createVehicleController:', error);
        res.status(500).json(createResponse(false, 'Internal server error', null));
    }
}

export const getVehiclesController = (prisma: PrismaClient) => async (req: Request, res: Response) => {
    try {
        const vehicles = await prisma.vehicle.findMany();
        return res.status(200).json(createResponse(true, 'Vehicles retrieved successfully', vehicles));
    } catch (error) {
        console.error('Error in getVehiclesController:', error);
        res.status(500).json(createResponse(false, 'Internal server error', null));
    }
}