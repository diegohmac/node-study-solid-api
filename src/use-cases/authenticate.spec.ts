import { hash } from 'bcrypt';
import { expect, describe, it, beforeEach } from 'vitest';

import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { InvalidCredentialsError } from '@/errors/invalid-credentials-error';
import { AuthenticateUseCase } from './authenticate';

let userRepository: InMemoryUsersRepository;
let authenticateUseCase: AuthenticateUseCase;

describe('Authenticate Use Case', () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository();
    authenticateUseCase = new AuthenticateUseCase(userRepository);
  });

  it('should be able to authenticate user', async () => {
    await userRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      passwordHash: await hash('123456', 6),
    });

    const { user } = await authenticateUseCase.execute({
      email: 'johndoe@example.com',
      password: '123456',
    });

    expect(user.id).toEqual(expect.any(String));
  });
  it('should not be able to authenticate user with incorrect email', async () => {
    await userRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      passwordHash: await hash('123456', 6),
    });

    await expect(
      authenticateUseCase.execute({
        email: 'incorrect-email@example.com',
        password: '123456',
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
  it('should not be able to authenticate user with incorrect password', async () => {
    await userRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      passwordHash: await hash('123456', 6),
    });

    await expect(
      authenticateUseCase.execute({
        email: 'johndoe@example.com',
        password: 'incorrect-password',
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
