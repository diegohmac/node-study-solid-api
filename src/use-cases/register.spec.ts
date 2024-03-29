import { expect, describe, it, beforeEach } from 'vitest';

import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { RegisterUseCase } from './register';
import { compare } from 'bcrypt';
import { UserAlreadyExistsError } from '@/errors/user-already-exists-error';

let usersRepository: InMemoryUsersRepository;
let registerUseCase: RegisterUseCase;

describe('Register Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    registerUseCase = new RegisterUseCase(usersRepository);
  });

  it('should register a new user', async () => {
    const { user } = await registerUseCase.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    expect(user.id).toEqual(expect.any(String));
  });
  it('should hash user password upon registration', async () => {
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
