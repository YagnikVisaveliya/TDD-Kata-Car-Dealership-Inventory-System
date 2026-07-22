import bcrypt from 'bcrypt';
import type { PrismaClient, User } from '../../generated/prisma/client';

const SALT_ROUNDS = 10;

type SafeUser = Omit<User, 'password'>;

export class AuthService {
  constructor(private prisma: PrismaClient) {}

  async register(name: string, email: string, password: string): Promise<SafeUser> {
    const existingUser = await this.prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await this.prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    const { password: _password, ...safeUser } = user;
    return safeUser;
  }
}