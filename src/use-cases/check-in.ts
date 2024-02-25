import { CheckInsRepository } from '@/repositories/check-ins-repository';

type CheckinParams = {
  userId: string;
  gymId: string;
};

export class CheckInUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({ userId, gymId }: CheckinParams) {
    const hasCheckInOnSameDay =
      await this.checkInsRepository.findByUserIdOnDate(userId, new Date());

    if (hasCheckInOnSameDay) {
      throw new Error('User already checked in today');
    }

    const checkIn = await this.checkInsRepository.create({
      userId,
      gymId,
    });

    return {
      checkIn,
    };
  }
}
