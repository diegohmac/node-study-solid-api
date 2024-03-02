import { expect, describe, it, beforeEach } from 'vitest';

import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { SearchGymsUseCase } from './search-gyms';

let gymsRepository: InMemoryGymsRepository;
let searchGymsUseCase: SearchGymsUseCase;

describe('Search Gyms Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository();
    searchGymsUseCase = new SearchGymsUseCase(gymsRepository);
  });

  it('should be able to search for gyms', async () => {
    await gymsRepository.create({
      name: 'Javascript Gym',
      description: null,
      phone: null,
      latitude: 0,
      longitude: 0,
    });
    await gymsRepository.create({
      name: 'Typescript Gym',
      description: null,
      phone: null,
      latitude: 0,
      longitude: 0,
    });

    const { gyms } = await searchGymsUseCase.execute({
      query: 'Typescript',
      page: 1,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([
      expect.objectContaining({
        name: 'Typescript Gym',
      }),
    ]);
  });

  it('should get paginated search gyms', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        name: `Typescript Gym ${i}`,
        description: null,
        phone: null,
        latitude: 0,
        longitude: 0,
      });
    }
    const { gyms } = await searchGymsUseCase.execute({
      query: 'Typescript',
      page: 2,
    });
    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({
        name: 'Typescript Gym 21',
      }),
      expect.objectContaining({
        name: 'Typescript Gym 22',
      }),
    ]);
  });
});
