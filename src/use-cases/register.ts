import { hash } from 'bcrypt';

import { UsersRepository } from '@/repositories/user-repository';

type ExecuteParams = {
  name: string;
  email: string;
  password: string;
};

export class RegisterUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ email, name, password }: ExecuteParams) {
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
