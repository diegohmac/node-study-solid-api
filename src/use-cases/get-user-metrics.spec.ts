import { expect, describe, it, beforeEach } from 'vitest';

import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { GetUserMetricsUseCase } from './get-user-metrics';

let checkInsRepository: InMemoryCheckInsRepository;
let getUserMetricsUseCase: GetUserMetricsUseCase;

describe('Get User Metrics Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    getUserMetricsUseCase = new GetUserMetricsUseCase(checkInsRepository);
  });

  it('should be able to get total check-ins count', async () => {
    await checkInsRepository.create({
      userId: 'user-id',
      gymId: 'gym-01',
    });
    await checkInsRepository.create({
      userId: 'user-id',
      gymId: 'gym-02',
    });

    const { checkInsCount } = await getUserMetricsUseCase.execute({
      userId: 'user-id',
    });

    expect(checkInsCount).toEqual(2);
  });
});
