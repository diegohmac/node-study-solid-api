import { PrismaUsersRepository } from '@/repositories/prisma-user-repository';
import { hash } from 'bcryptjs';

type RegisterUseCaseRequest = {
  name: string;
  email: string;
  password: string;
};

export class RegisterUseCase {
  constructor(private usersRepository: PrismaUsersRepository) {}

  async execute({ email, name, password }: RegisterUseCaseRequest) {
    const userAlreadyExists = await this.usersRepository.findByEmail(email);

    if (userAlreadyExists) {
      throw new Error('User already exists');
    }

    const passwordHash = await hash(password, 6);

    await this.usersRepository.create({
      name: name,
      email: email,
      passwordHash,
    });
  }
}
