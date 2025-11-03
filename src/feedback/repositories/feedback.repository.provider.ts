import { Injectable, Provider } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DataSource } from '@/constants';
import { Feedback } from '@/feedback/models/feedback.model';
import { FeedbackTypeOrmRepository } from '@/feedback/repositories/implementations/feedback.typeorm.repository';
import { FEEDBACK_REPOSITORY_TOKEN  } from '@/feedback/interfaces/feedback.repository.interface';

export function provideFeedbackRepository(): Provider[] {
  return [
    {
      provide: FEEDBACK_REPOSITORY_TOKEN,
      useFactory: (dependenciesProvider: FeedbackRepoDependenciesProvider) => provideUsersRepositoryFactory(dependenciesProvider),
      inject: [FeedbackRepoDependenciesProvider],
    },
    FeedbackRepoDependenciesProvider,
  ];
}

function provideUsersRepositoryFactory(dependenciesProvider: FeedbackRepoDependenciesProvider) {
  const dataSourceEnv = process.env.FEEDBACK_DATASOURCE;

  if (!dataSourceEnv || !Object.values(DataSource).includes(dataSourceEnv as DataSource)) {
    throw new Error(`Invalid FEEDBACK_DATASOURCE value: ${dataSourceEnv}`);
  }

  const dataSource = dataSourceEnv as DataSource;

  switch (dataSource) {
    case DataSource.TYPEORM:
      return new FeedbackTypeOrmRepository(dependenciesProvider.typeOrmRepository);
  }
}

@Injectable()
export class FeedbackRepoDependenciesProvider {
  constructor(
    @InjectRepository(Feedback)
    public typeOrmRepository: Repository<Feedback>,
  ) {}
}
