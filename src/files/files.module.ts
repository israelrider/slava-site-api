import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { FilesController } from './files.controller';

@Module({
  imports: [HttpModule],
  controllers: [FilesController],
})
export class FilesModule {}
