import { ResourceNotFoundError } from '@/errors/resource-not-found-error';
import { CheckInsRepository } from '@/repositories/check-ins-repository';
import { GymsRepository } from '@/repositories/gyms-repository';

type CheckinParams = {
  userId: string;
  gymId: string;
  userLatitude: number;
  userLongitude: number;
};

export class CheckInUseCase {
  constructor(
    private checkInsRepository: CheckInsRepository,
    private gymsRepository: GymsRepository
  ) {}

  async execute({ userId, gymId, userLatitude, userLongitude }: CheckinParams) {
    const gym = await this.gymsRepository.findById(gymId);

    if (!gym) {
      throw new ResourceNotFoundError();
    }

    // TODO: calculate distance between user and gym

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
