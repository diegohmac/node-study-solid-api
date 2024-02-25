import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest';

import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-checkins-repository';
import { CheckInUseCase } from './check-in';

let checkInsRepository: InMemoryCheckInsRepository;
let checkInUseCase: CheckInUseCase;

describe('Check In Use Case', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository();
    checkInUseCase = new CheckInUseCase(checkInsRepository);
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be able to check in', async () => {
    const { checkIn } = await checkInUseCase.execute({
      userId: 'user-id',
      gymId: 'gym-id',
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it('should not be able to check in twice in a day', async () => {
    vi.setSystemTime(new Date(2024, 1, 15, 10, 0, 0));
    await checkInUseCase.execute({
      userId: 'user-id',
      gymId: 'gym-id',
    });

    await expect(
      checkInUseCase.execute({
        userId: 'user-id',
        gymId: 'gym-id',
      })
    ).rejects.toBeInstanceOf(Error);
  });

  it('should allow to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2024, 1, 15, 10, 0, 0));
    await checkInUseCase.execute({
      userId: 'user-id',
      gymId: 'gym-id',
    });
    vi.setSystemTime(new Date(2024, 1, 16, 10, 0, 0));

    const { checkIn } = await checkInUseCase.execute({
      userId: 'user-id',
      gymId: 'gym-id',
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });
});
