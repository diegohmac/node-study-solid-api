import { PrismaUsersRepository } from '@/repositories/prisma-user-repository';
import { hash } from 'bcryptjs';

type RegisterUseCaseRequest = {
  name: string;
  email: string;
  password: string;
};

export async function registerUseCase({
  name,
  email,
  password,
}: RegisterUseCaseRequest) {
  const prismaUserRepository = new PrismaUsersRepository();

  const userWithSameEmail = await prismaUserRepository.findByEmail(email);

  if (userWithSameEmail) {
    throw new Error('Email already exists');
  }

  const passwordHash = await hash(password, 6);

  await prismaUserRepository.create({
    name,
    email,
    passwordHash,
  });
}
