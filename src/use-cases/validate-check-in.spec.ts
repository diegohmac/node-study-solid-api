import { expect, describe, it, beforeEach, afterEach, vi } from 'vitest';

import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-checkins-repository';
import { ValidateCheckInUseCase } from './validate-check-in';
import { ResourceNotFoundError } from '@/errors/resource-not-found-error';
import { LateCheckInValidationError } from '@/errors/late-check-in-validation-error';

let checkInsRepository: InMemoryCheckInsRepository;
let validateCheckInUseCase: ValidateCheckInUseCase;

describe('Validate Check In Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    validateCheckInUseCase = new ValidateCheckInUseCase(checkInsRepository);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be able to validate the check-in', async () => {
    const createdCheckIn = await checkInsRepository.create({
      gymId: 'gym-id',
      userId: 'user-id',
    });

    const { checkIn } = await validateCheckInUseCase.execute({
      checkInId: createdCheckIn.id,
    });

    expect(checkIn.validatedAt).toEqual(expect.any(Date));
    expect(checkInsRepository.checkIns[0].validatedAt).toEqual(
      expect.any(Date)
    );
  });

  it('should be able to validate the non existing check-in', async () => {
    await expect(
      validateCheckInUseCase.execute({
        checkInId: 'non-existing-check-in-id',
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not be able to validate the check-in after 20 minutes of creation', async () => {
    vi.setSystemTime(new Date(2024, 2, 3, 13, 40));

    const createdCheckIn = await checkInsRepository.create({
      gymId: 'gym-id',
      userId: 'user-id',
    });

    const TWENTY_ONE_MINUTES_IN_MS = 21 * 60 * 1000;
    vi.advanceTimersByTime(TWENTY_ONE_MINUTES_IN_MS);

    await expect(
      validateCheckInUseCase.execute({
        checkInId: createdCheckIn.id,
      })
    ).rejects.toBeInstanceOf(LateCheckInValidationError);
  });
});
