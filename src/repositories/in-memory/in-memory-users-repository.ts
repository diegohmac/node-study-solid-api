import { randomUUID } from 'node:crypto';
import { User, Prisma } from '@prisma/client';

import { UsersRepository } from '@/repositories/user-repository';

export class InMemoryUsersRepository implements UsersRepository {
  private users: User[] = [];

  async findByEmail(email: string) {
    const user = this.users.find((user) => user.email === email);

    if (!user) {
      return null;
    }
    return user;
  }

  async create(data: Prisma.UserCreateInput) {
    const user = {
      id: randomUUID(),
      ...data,
      createdAt: new Date(),
    };

    this.users.push(user);

    return user;
  }
}
