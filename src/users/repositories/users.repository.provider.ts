import { Injectable, Provider } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DataSource } from '@/constants';
import { User } from '@/users/models/user.model';
import { HashingService } from '@/common/hashing/hashing.service';
import { UsersTypeOrmRepository } from '@/users/repositories/implementations/users.typeorm.repository';
import { USERS_REPOSITORY_TOKEN } from '@/users/interfaces/users.repository.interface';

export function provideUsersRepository(): Provider[] {
  return [
    {
      provide: USERS_REPOSITORY_TOKEN,
      useFactory: (dependenciesProvider: UsersRepoDependenciesProvider) => provideUsersRepositoryFactory(dependenciesProvider),
      inject: [UsersRepoDependenciesProvider],
    },
    UsersRepoDependenciesProvider,
  ];
}

function provideUsersRepositoryFactory(dependenciesProvider: UsersRepoDependenciesProvider) {
  const dataSourceEnv = process.env.USERS_DATASOURCE;

  if (!dataSourceEnv || !Object.values(DataSource).includes(dataSourceEnv as DataSource)) {
    throw new Error(`Invalid USERS_DATASOURCE: ${dataSourceEnv}`);
  }

  const dataSource = dataSourceEnv as DataSource;

  switch (dataSource) {
    case DataSource.TYPEORM:
      return new UsersTypeOrmRepository(dependenciesProvider.typeOrmRepository, dependenciesProvider.hashingService);
  }
}

@Injectable()
export class UsersRepoDependenciesProvider {
  constructor(
    @InjectRepository(User)
    public typeOrmRepository: Repository<User>,
    public hashingService: HashingService,
  ) {}
}
