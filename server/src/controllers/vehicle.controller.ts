import { Request, Response} from 'express';
import { PrismaClient } from '../../generated/prisma/client';
import { createResponse } from '../utils/api-response.js';
import { isValidVehicleMake, isValidVehicleQuantity, isValidVehiclePrice, isValidVehicleModel, isValidVehicleCategory } from '../utils/InputValidation';

interface UpdateVehicleParams {
  id: string; 
}


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

export const searchVehiclesController = (prisma: PrismaClient) => async (req: Request, res: Response) => {
    try {
        const { make, model, category, minPrice, maxPrice } = req.query;
        const filters: any = {};

        if (make) filters.make = { equals: String(make), mode: 'insensitive' };
        if (model) filters.model = { equals: String(model), mode: 'insensitive' };
        if (category) filters.category = { equals: String(category), mode: 'insensitive' };

        if (minPrice !== undefined || maxPrice !== undefined) {
            filters.price = {};

            if (minPrice !== undefined) {
                const min = Number(minPrice);
                if (isNaN(min)) {
                return res.status(400).json(createResponse(false, 'minPrice must be a valid number', null));
                }
                filters.price.gte = min;
            }

            if (maxPrice !== undefined) {
                const max = Number(maxPrice);
                if (isNaN(max)) {
                return res.status(400).json(createResponse(false, 'maxPrice must be a valid number', null));
                }
                filters.price.lte = max;
            }
        }
        const vehicles = await prisma.vehicle.findMany({ where: filters });
        return res.status(200).json(createResponse(true, 'Search results retrieved successfully', vehicles));
        
    } catch (error) {
        console.error('Error in searchVehiclesController:', error);
        res.status(500).json(createResponse(false, 'Internal server error', null));
    }
}

export const updateVehicleController = (prisma: PrismaClient) => async (req: Request<UpdateVehicleParams>, res: Response) => {
    try {
        const { id } = req.params;
        const { make, model, category, price, quantity } = req.body;

        const existingVehicle = await prisma.vehicle.findUnique({ where: { id } });
        if(!existingVehicle) {
            return res.status(404).json(createResponse(false, 'Vehicle not found', null));
        }

        const updateData: any = {};
        if (make !== undefined) {
            if(!isValidVehicleMake(make)) {
                return res.status(400).json(createResponse(false, 'Make is required', null));
            }
            updateData.make = (make as string).trim();
        }
        if (model !== undefined) {
            if(!isValidVehicleModel(model)) {
                return res.status(400).json(createResponse(false, 'Model is required', null));
            }
            updateData.model = (model as string).trim();
        }
        if (category !== undefined) {
            if(!isValidVehicleCategory(category)) {
                return res.status(400).json(createResponse(false, 'Category is required', null));
            }
            updateData.category = (category as string).trim();
        }
        if (price !== undefined) {
            if(!isValidVehiclePrice(price)) {
                return res.status(400).json(createResponse(false, 'Valid price is required', null));
            }
            updateData.price = price;
        }
        if (quantity !== undefined) {
            if(!isValidVehicleQuantity(quantity)) {
                return res.status(400).json(createResponse(false, 'Valid quantity is required', null));
            }
            updateData.quantity = quantity;
        }

        const updatedVehicle = await prisma.vehicle.update({
            where: { id },
            data: updateData,
        });

        return res.status(200).json(createResponse(true, 'Vehicle updated successfully', updatedVehicle));


    } catch (error) {
        console.error('Error in updateVehicleController:', error);
        res.status(500).json(createResponse(false, 'Internal server error', null));
    }
}

export const deleteVehicleController = (prisma: PrismaClient) => async (req: Request<UpdateVehicleParams>, res: Response) => {
    try {
        const { id } = req.params;
        const existingVehicle = await prisma.vehicle.findUnique({ where: { id } });
        if(!existingVehicle) {
            return res.status(404).json(createResponse(false, 'Vehicle not found', null));
        }
        await prisma.vehicle.delete({ where: { id } });
        return res.status(200).json(createResponse(true, 'Vehicle deleted successfully', null));
    } catch (error) {
        console.error('Error in deleteVehicleController:', error);
        res.status(500).json(createResponse(false, 'Internal server error', null));
    }
}

export const purchaseVehicleController = (prisma: PrismaClient) => async (req: Request<UpdateVehicleParams>, res: Response) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;
        if (quantity === undefined || typeof quantity !== 'number' || isNaN(quantity) || quantity <= 0) {
        return res.status(400).json(createResponse(false, 'Quantity must be a positive number', null));
        }

        const vehicle = await prisma.vehicle.findUnique({ where: { id } });
        if (!vehicle) {
        return res.status(404).json(createResponse(false, 'Vehicle not found', null));
        }

        if (vehicle.quantity < quantity) {
        return res.status(400).json(createResponse(false, 'Insufficient stock for this purchase', null));
        }

        // Atomic decrement — avoids a race condition where two purchases
        // read the same quantity before either writes back.
        const updated = await prisma.vehicle.update({
        where: { id },
        data: { quantity: { decrement: quantity } },
        });

        return res.status(200).json(createResponse(true, 'Purchase successful', updated));

    } catch (error) {
        console.error('Error in purchaseVehicleController:', error);
        res.status(500).json(createResponse(false, 'Internal server error', null));
    }
}

export const restockVehicleController = (prisma: PrismaClient) => async (req: Request<UpdateVehicleParams>, res: Response) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;

        if (quantity === undefined || typeof quantity !== 'number' || isNaN(quantity) || quantity <= 0) {
            return res.status(400).json(createResponse(false, 'Quantity must be a positive number', null));
        }

        const vehicle = await prisma.vehicle.findUnique({ where: { id } });
        if (!vehicle) {
            return res.status(404).json(createResponse(false, 'Vehicle not found', null));
        }

        const updated = await prisma.vehicle.update({
            where: { id },
            data: { quantity: { increment: quantity } },
        });

        return res.status(200).json(createResponse(true, 'Restock successful', updated));
    } catch (error) {
        console.error('Error in restockVehicleController:', error);
        res.status(500).json(createResponse(false, 'Internal server error', null));
    }
}