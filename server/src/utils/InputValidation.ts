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
