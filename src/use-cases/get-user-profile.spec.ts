import { hash } from 'bcrypt';
import { expect, describe, it, beforeEach } from 'vitest';

import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { GetUserProfileUseCaseUseCase } from './get-user-profile';
import { ResourceNotFoundError } from '@/errors/resource-not-found-error';

let userRepository: InMemoryUsersRepository;
let getUserProfileUseCase: GetUserProfileUseCaseUseCase;

describe('Get User Profile Use Case', () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository();
    getUserProfileUseCase = new GetUserProfileUseCaseUseCase(userRepository);
  });

  it('should be able to get user profile', async () => {
    const createdUser = await userRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      passwordHash: await hash('123456', 6),
    });

    const { user } = await getUserProfileUseCase.execute({
      userId: createdUser.id,
    });

    expect(user.id).toEqual(expect.any(String));
  });
  it('should not be able to get user profile with incorrect userId', async () => {
    await expect(
      getUserProfileUseCase.execute({
        userId: 'incorrect-user-id',
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
