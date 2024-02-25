import { InvalidCredentialsError } from '@/errors/invalid-credentials-error';
import { UsersRepository } from '@/repositories/user-repository';
import { compare } from 'bcrypt';

type AuthenticateParams = {
  email: string;
  password: string;
};

export class AuthenticateUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ email, password }: AuthenticateParams) {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new InvalidCredentialsError();
    }

    const passwordMatch = await compare(password, user.passwordHash);

    if (!passwordMatch) {
      throw new InvalidCredentialsError();
    }

    return {
      user,
    };
  }
}
