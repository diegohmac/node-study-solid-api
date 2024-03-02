import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest';

import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-checkins-repository';
import { CheckInUseCase } from './check-in';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { Decimal } from '@prisma/client/runtime/library';
import { MaxNumbersOfCheckInsError } from '@/errors/max-numbers-of-check-ins-error';
import { MaxDistanceError } from '@/errors/max-distance-error';

let checkInsRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let checkInUseCase: CheckInUseCase;

describe('Check In Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    gymsRepository = new InMemoryGymsRepository();

    checkInUseCase = new CheckInUseCase(checkInsRepository, gymsRepository);

    await gymsRepository.create({
      id: 'gym-id',
      name: 'Typescript Gym',
      description: '',
      phone: '',
      latitude: 0,
      longitude: 0,
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be able to check in', async () => {
    const { checkIn } = await checkInUseCase.execute({
      userId: 'user-id',
      gymId: 'gym-id',
      userLatitude: 0,
      userLongitude: 0,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it('should not be able to check in twice in a day', async () => {
    vi.setSystemTime(new Date(2024, 1, 15, 10, 0, 0));
    await checkInUseCase.execute({
      userId: 'user-id',
      gymId: 'gym-id',
      userLatitude: 0,
      userLongitude: 0,
    });

    await expect(
      checkInUseCase.execute({
        userId: 'user-id',
        gymId: 'gym-id',
        userLatitude: 0,
        userLongitude: 0,
      })
    ).rejects.toBeInstanceOf(MaxNumbersOfCheckInsError);
  });

  it('should allow to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2024, 1, 15, 10, 0, 0));
    await checkInUseCase.execute({
      userId: 'user-id',
      gymId: 'gym-id',
      userLatitude: 0,
      userLongitude: 0,
    });
    vi.setSystemTime(new Date(2024, 1, 16, 10, 0, 0));

    const { checkIn } = await checkInUseCase.execute({
      userId: 'user-id',
      gymId: 'gym-id',
      userLatitude: 0,
      userLongitude: 0,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it('should not be able to check in if far away from the gym', async () => {
    gymsRepository.gyms.push({
      id: 'gym-id-2',
      name: 'React Gym',
      description: '',
      latitude: new Decimal(40),
      longitude: new Decimal(40),
      phone: '',
      createdAt: new Date(),
    });

    await expect(
      checkInUseCase.execute({
        userId: 'user-id',
        gymId: 'gym-id-2',
        userLatitude: 0,
        userLongitude: 0,
      })
    ).rejects.toBeInstanceOf(MaxDistanceError);
  });
});
