import { Controller, Get, Logger, NotFoundException, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FastifyReply } from 'fastify';
import * as fs from 'node:fs';
import { createReadStream } from 'node:fs';
import { join } from 'node:path';

import { Auth } from '@/iam/decorators/auth.decorator';
import { AuthType } from '@/iam/enums/auth-type.enum';

@Auth(AuthType.None)
@ApiTags('download')
@Controller('download')
export class FilesController {
  @Get('stream')
  async streamFile(@Res({ passthrough: true }) reply: FastifyReply): Promise<void> {
    const filename = 'Resume.pdf';
    const filePath = join(process.cwd(), 'src/files', filename);
    const stream = createReadStream(filePath);
    reply.header('Content-Type', 'application/pdf');
    reply.header('Content-Disposition', `attachment; filename="${filename}"`);

    await reply.send(stream);
  }
}
