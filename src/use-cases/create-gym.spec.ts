import { expect, describe, it, beforeEach } from 'vitest';

import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { CreateGymUseCase } from './create-gym';

let gymsRepository: InMemoryGymsRepository;
let createGymUseCase: CreateGymUseCase;

describe('Register Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    createGymUseCase = new CreateGymUseCase(gymsRepository);
  });

  it('should create a new gym', async () => {
    const { gym } = await createGymUseCase.execute({
      name: 'Typescript Gym',
      description: 'The best gym in the world',
      phone: '123456789',
      latitude: -23.561399,
      longitude: -46.655348,
    });

    expect(gym.id).toEqual(expect.any(String));
  });
});
