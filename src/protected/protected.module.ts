import { Module } from '@nestjs/common';

import { CatsController } from '@/protected/cats.controller';
import { CatsService } from '@/protected/cats.service';

@Module({
  controllers: [CatsController],
  providers: [
    CatsService,
  ],
})
export class ProtectedModule {}
