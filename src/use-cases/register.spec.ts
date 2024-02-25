import { expect, describe, it } from 'vitest';

import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { RegisterUseCase } from './register';
import { compare } from 'bcrypt';
import { UserAlreadyExistsError } from '@/errors/user-already-exists-error';

describe('Register Use Case', () => {
  it('should register a new user', async () => {
    const usersRepository = new InMemoryUsersRepository();
    const registerUseCase = new RegisterUseCase(usersRepository);

    const { user } = await registerUseCase.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    expect(user.id).toEqual(expect.any(String));
  });
  it('should hash user password upon registration', async () => {
    const usersRepository = new InMemoryUsersRepository();
    const registerUseCase = new RegisterUseCase(usersRepository);

    const { user } = await registerUseCase.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const isPasswordCorrectlyHashed = await compare(
      '123456',
      user.passwordHash
    );

    expect(isPasswordCorrectlyHashed).toBe(true);
  });
  it('should not allow a user to register with an email that is already in use', async () => {
    const usersRepository = new InMemoryUsersRepository();
    const registerUseCase = new RegisterUseCase(usersRepository);

    const email = 'johndoe@example.com';

    await registerUseCase.execute({
      name: 'John Doe',
      email,
      password: '123456',
    });

    await expect(() =>
      registerUseCase.execute({
        name: 'John Doe',
        email,
        password: '123456',
      })
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});
