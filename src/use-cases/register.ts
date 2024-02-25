import { hash } from 'bcrypt';

import { UsersRepository } from '@/repositories/user-repository';
import { UserAlreadyExistsError } from '@/errors/user-already-exists-error';

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
      throw new UserAlreadyExistsError();
    }

    const passwordHash = await hash(password, 6);

    const user = await this.usersRepository.create({
      name: name,
      email: email,
      passwordHash,
    });

    return {
      user,
    };
  }
}
