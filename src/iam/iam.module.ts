import { Module } from '@nestjs/common';

import { UsersModule } from '@/users/users.module';
import { UtilsModule } from '@/common/utils/utils.module';
import { IamController } from '@/iam/iam.controller';
import { IamService } from '@/iam/iam.service';

@Module({
  imports: [
    UsersModule,
    UtilsModule,
  ],
  controllers: [
    IamController,
  ],
  providers: [
    IamService,
  ],
})
export class IamModule {}
