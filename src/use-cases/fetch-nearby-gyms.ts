import { GymsRepository } from '@/repositories/gyms-repository';

type ExecuteParams = {
  userLatitude: number;
  userLongitude: number;
};

export class FetchNearbyGymsUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({ userLatitude, userLongitude }: ExecuteParams) {
    const gyms = await this.gymsRepository.findManyNearby({
      latitude: userLatitude,
      longitude: userLongitude,
    });

    return {
      gyms,
    };
  }
}
