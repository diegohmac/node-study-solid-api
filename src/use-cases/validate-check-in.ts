import { ResourceNotFoundError } from '@/errors/resource-not-found-error';
import { CheckInsRepository } from '@/repositories/check-ins-repository';

type ValidateCheckInParams = {
  checkInId: string;
};

export class ValidateCheckInUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({ checkInId }: ValidateCheckInParams) {
    const checkIn = await this.checkInsRepository.findById(checkInId);

    if (!checkIn) {
      throw new ResourceNotFoundError();
    }

    checkIn.validatedAt = new Date();

    await this.checkInsRepository.save(checkIn);

    return {
      checkIn,
    };
  }
}
