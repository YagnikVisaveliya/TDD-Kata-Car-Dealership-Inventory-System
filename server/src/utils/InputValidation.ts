export function isValidEmail(email: string): boolean {
    if(!email || typeof email !== 'string') {
        return false;
    }
    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return EMAIL_REGEX.test(email);
}

export function isValidPassword(password: string): boolean {
    const MIN_PASSWORD_LENGTH = 8;
    return typeof password === 'string' && password.length >= MIN_PASSWORD_LENGTH;
}

export function isValidName(name: string): boolean {
    return typeof name === 'string' && name.trim().length > 0;
}

export function isValidVehicleMake(make: string): boolean {
    return typeof make === 'string' && make.trim().length > 0;
}

export function isValidVehicleModel(model: string): boolean {
    return typeof model === 'string' && model.trim().length > 0;
}

export function isValidVehicleCategory(category: string): boolean {
    return typeof category === 'string' && category.trim().length > 0;
}

export function isValidVehiclePrice(price: number): boolean {
    return typeof price === 'number' && price > 0;
}

export function isValidVehicleQuantity(quantity: number): boolean {
    return typeof quantity === 'number' && quantity >= 0;
}
