import { ResourceNotFoundError } from '@/errors/resource-not-found-error';
import { UsersRepository } from '@/repositories/user-repository';

type GetUserProfileParams = {
  userId: string;
};

export class GetUserProfileUseCaseUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ userId }: GetUserProfileParams) {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new ResourceNotFoundError();
    }

    return {
      user,
    };
  }
}
