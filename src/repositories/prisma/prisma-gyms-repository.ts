import { Gym, Prisma } from '@prisma/client';
import { FindManyNearbyParams, GymsRepository } from '../gyms-repository';
import { prisma } from '@/lib/prisma';

export class PrismaGymsRepository implements GymsRepository {
  async findById(id: string) {
    const gym = await prisma.gym.findUnique({
      where: {
        id,
      },
    });
    return gym;
  }
  async findManyNearby({ latitude, longitude }: FindManyNearbyParams) {
    const EARTH_RADIUS_IN_KM = 6371;
    const MAX_DISTANCE_IN_KM = 10;
    const gyms = await prisma.$queryRaw<Gym[]>`
        SELECT * FROM gyms
        WHERE ( ${EARTH_RADIUS_IN_KM} * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) ) <= ${MAX_DISTANCE_IN_KM}
    `;

    return gyms;
  }
  async searchMany(query: string, page: number) {
    const gyms = await prisma.gym.findMany({
      where: {
        name: {
          contains: query,
        },
      },
      take: 20,
      skip: (page - 1) * 20,
    });
    return gyms;
  }
  async create(data: Prisma.GymCreateInput) {
    const gym = await prisma.gym.create({
      data,
    });
    return gym;
  }
}
