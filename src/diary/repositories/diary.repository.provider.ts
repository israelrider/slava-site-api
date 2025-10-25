import { Injectable, Provider } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DataSource } from '@/constants';
import { Diary } from '@/diary/models/diary.model';
import { DiaryTypeOrmRepository } from '@/diary/repositories/implementations/diary.typeorm.repository';
import { DIARY_REPOSITORY_TOKEN  } from '@/diary/interfaces/diary.repository.interface';

export function provideDiaryRepository(): Provider[] {
  return [
    {
      provide: DIARY_REPOSITORY_TOKEN,
      useFactory: (dependenciesProvider: DiaryRepoDependenciesProvider) => provideUsersRepositoryFactory(dependenciesProvider),
      inject: [DiaryRepoDependenciesProvider],
    },
    DiaryRepoDependenciesProvider,
  ];
}

function provideUsersRepositoryFactory(dependenciesProvider: DiaryRepoDependenciesProvider) {
  const dataSourceEnv = process.env.DIARY_DATASOURCE;

  if (!dataSourceEnv || !Object.values(DataSource).includes(dataSourceEnv as DataSource)) {
    throw new Error(`Invalid DIARY_DATASOURCE value: ${dataSourceEnv}`);
  }

  const dataSource = dataSourceEnv as DataSource;

  switch (dataSource) {
    case DataSource.TYPEORM:
      return new DiaryTypeOrmRepository(dependenciesProvider.typeOrmRepository);
  }
}

@Injectable()
export class DiaryRepoDependenciesProvider {
  constructor(
    @InjectRepository(Diary)
    public typeOrmRepository: Repository<Diary>,
  ) {}
}
