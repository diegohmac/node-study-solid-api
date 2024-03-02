import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { GetUserProfileUseCaseUseCase } from '../get-user-profile';

export function makeGetUserProfileUseCase() {
  const prismaUsersRepository = new PrismaUsersRepository();
  const useCase = new GetUserProfileUseCaseUseCase(prismaUsersRepository);

  return useCase;
}
