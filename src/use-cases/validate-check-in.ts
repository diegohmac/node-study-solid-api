import { LateCheckInValidationError } from '@/errors/late-check-in-validation-error';
import { ResourceNotFoundError } from '@/errors/resource-not-found-error';
import { CheckInsRepository } from '@/repositories/check-ins-repository';
import dayjs from 'dayjs';

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

    const distanceInMinutesFromCheckInCreation = dayjs(new Date()).diff(
      checkIn.createdAt,
      'minutes'
    );

    if (distanceInMinutesFromCheckInCreation > 20) {
      throw new LateCheckInValidationError();
    }

    checkIn.validatedAt = new Date();

    await this.checkInsRepository.save(checkIn);

    return {
      checkIn,
    };
  }
}
