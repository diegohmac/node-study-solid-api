import { expect, describe, it, beforeEach, afterEach } from 'vitest';

import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-checkins-repository';
import { ValidateCheckInUseCase } from './validate-check-in';
import { ResourceNotFoundError } from '@/errors/resource-not-found-error';

let checkInsRepository: InMemoryCheckInsRepository;
let validateCheckInUseCase: ValidateCheckInUseCase;

describe('Validate Check In Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    validateCheckInUseCase = new ValidateCheckInUseCase(checkInsRepository);

    // vi.useFakeTimers();
  });

  afterEach(() => {
    // vi.useRealTimers();
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
});
