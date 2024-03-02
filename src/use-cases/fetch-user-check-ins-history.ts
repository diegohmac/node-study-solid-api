import { CheckInsRepository } from '@/repositories/check-ins-repository';

type FetchUserCheckInsHistoryParams = {
  userId: string;
  page: number;
};

export class FetchUserCheckInsHistoryUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({ userId, page }: FetchUserCheckInsHistoryParams) {
    const checkIns = await this.checkInsRepository.findManyByUserId(
      userId,
      page
    );

    return {
      checkIns,
    };
  }
}
