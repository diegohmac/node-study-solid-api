import { GymsRepository } from '@/repositories/gyms-repository';

type ExecuteParams = {
  name: string;
  description: string | null;
  phone: string | null;
  latitude: number;
  longitude: number;
};

export class CreateGymUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    name,
    description,
    phone,
    latitude,
    longitude,
  }: ExecuteParams) {
    const gym = await this.gymsRepository.create({
      name,
      description,
      phone,
      latitude,
      longitude,
    });

    return {
      gym,
    };
  }
}
