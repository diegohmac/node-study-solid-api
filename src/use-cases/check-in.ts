import { MaxDistanceError } from '@/errors/max-distance-error';
import { MaxNumbersOfCheckInsError } from '@/errors/max-numbers-of-check-ins-error';
import { ResourceNotFoundError } from '@/errors/resource-not-found-error';
import { CheckInsRepository } from '@/repositories/check-ins-repository';
import { GymsRepository } from '@/repositories/gyms-repository';
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates';

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

    const distance = getDistanceBetweenCoordinates(
      {
        latitude: gym.latitude.toNumber(),
        longitude: gym.longitude.toNumber(),
      },
      {
        latitude: userLatitude,
        longitude: userLongitude,
      }
    );

    const MAX_DISTANCE_IN_KILOMETERS = 0.1;

    if (distance > MAX_DISTANCE_IN_KILOMETERS) {
      throw new MaxDistanceError();
    }

    const hasCheckInOnSameDay =
      await this.checkInsRepository.findByUserIdOnDate(userId, new Date());

    if (hasCheckInOnSameDay) {
      throw new MaxNumbersOfCheckInsError();
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
