import { GymsRepository } from '@/repositories/gyms-repository';

type ExecuteParams = {
  query: string;
  page: number;
};

export class SearchGymsUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({ query, page }: ExecuteParams) {
    const gyms = await this.gymsRepository.searchMany(query, page);

    return {
      gyms,
    };
  }
}
