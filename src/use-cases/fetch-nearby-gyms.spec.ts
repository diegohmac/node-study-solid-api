import { expect, describe, it, beforeEach } from 'vitest';

import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms';

let gymsRepository: InMemoryGymsRepository;
let fetchNearbyGymsUseCase: FetchNearbyGymsUseCase;

describe('Fetch Nearby Gyms Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository();
    fetchNearbyGymsUseCase = new FetchNearbyGymsUseCase(gymsRepository);
  });

  it('should be able to fetch nearby gyms up to 10km', async () => {
    await gymsRepository.create({
      name: 'Near Gym',
      description: null,
      phone: null,
      latitude: 40.6574779,
      longitude: -7.9216167,
    });
    await gymsRepository.create({
      name: 'Far Gym',
      description: null,
      phone: null,
      latitude: 40.416217,
      longitude: -7.7052308,
    });

    const { gyms } = await fetchNearbyGymsUseCase.execute({
      userLatitude: 40.6580605,
      userLongitude: -7.9089743,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([
      expect.objectContaining({
        name: 'Near Gym',
      }),
    ]);
  });
});
