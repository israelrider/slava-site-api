import { Module } from '@nestjs/common';

import { AskFromController } from '@/ask-from/askFrom.controller'
import { AskFromService } from '@/ask-from/askFrom.service'

@Module({
  controllers: [AskFromController],
  providers: [AskFromService],
})
export class AskFromModule {}
