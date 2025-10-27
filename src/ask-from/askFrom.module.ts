import { Module } from '@nestjs/common';

import { AskFromController } from '@/ask-from/askFrom.controller';
import { AskFromService } from '@/ask-from/askFrom.service';
import { UtilsModule } from '@/common/utils/utils.module';

@Module({
  imports:[UtilsModule],
  controllers: [AskFromController],
  providers: [AskFromService],
})
export class AskFromModule {}
