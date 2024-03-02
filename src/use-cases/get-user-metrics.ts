import { CheckInsRepository } from '@/repositories/check-ins-repository';

type GetUserMetricsParams = {
  userId: string;
};

export class GetUserMetricsUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({ userId }: GetUserMetricsParams) {
    const checkInsCount = await this.checkInsRepository.countByUserId(userId);

    return {
      checkInsCount,
    };
  }
}
