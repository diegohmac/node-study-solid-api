import { CheckInsRepository } from '@/repositories/check-ins-repository';

type CheckinParams = {
  userId: string;
  gymId: string;
};

export class CheckInUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({ userId, gymId }: CheckinParams) {
    const checkIn = await this.checkInsRepository.create({
      userId,
      gymId,
    });

    return {
      checkIn,
    };
  }
}
