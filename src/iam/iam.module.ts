import { Module } from '@nestjs/common';

import { UsersModule } from '@/users/users.module';
import { IamController } from '@/iam/iam.controller';
import { IamService } from '@/iam/iam.service';
import { MailerService } from '@/common/mailer/mailer.service';

@Module({
  imports: [UsersModule],
  controllers: [IamController],
  providers: [
    MailerService,
    IamService,
  ],
})
export class IamModule {}
