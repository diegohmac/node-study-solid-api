import { expect, describe, it, beforeEach } from 'vitest';

import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-checkins-repository';
import { FetchUserCheckInsHistoryCase } from './fetch-user-check-ins-history';

let checkInsRepository: InMemoryCheckInsRepository;
let fetchUserCheckInsHistoryCase: FetchUserCheckInsHistoryCase;

describe('Fetch User Check-in History Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    fetchUserCheckInsHistoryCase = new FetchUserCheckInsHistoryCase(
      checkInsRepository
    );
  });

  it('should be able to fetch check-in history', async () => {
    await checkInsRepository.create({
      userId: 'user-id',
      gymId: 'gym-01',
    });
    await checkInsRepository.create({
      userId: 'user-id',
      gymId: 'gym-02',
    });

    const { checkIns } = await fetchUserCheckInsHistoryCase.execute({
      userId: 'user-id',
      page: 1,
    });

    expect(checkIns).toHaveLength(2);
    expect(checkIns).toEqual([
      expect.objectContaining({
        gymId: 'gym-01',
      }),
      expect.objectContaining({
        gymId: 'gym-02',
      }),
    ]);
  });

  it('should be able to fetch paginated check-in history', async () => {
    for (let i = 1; i <= 22; i++) {
      await checkInsRepository.create({
        userId: 'user-id',
        gymId: `gym-${i}`,
      });
    }

    const { checkIns } = await fetchUserCheckInsHistoryCase.execute({
      userId: 'user-id',
      page: 2,
    });

    expect(checkIns).toEqual([
      expect.objectContaining({
        gymId: 'gym-21',
      }),
      expect.objectContaining({
        gymId: 'gym-22',
      }),
    ]);
  });
});
