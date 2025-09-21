import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';

import { Roles } from '@/iam/login/decorators/roles.decorator';
import { RolesGuard } from '@/iam/login/guards/roles/roles.guard';
import { Role } from '@/iam/login/enums/roles.enum';
import { CatsService } from '@/protected/cats.service';
import { CreateCatDto } from '@/protected/dto/create-cat.dto';

@UseGuards(RolesGuard)
@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Post()
  @Roles(Role.Reader)
  create(@Body() createCatDto: CreateCatDto) {
    this.catsService.create(createCatDto);
  }

  // @Param('id', new ParseIntPipe())
  @Get(':id')
  findOne(id: number) {
    console.log(id);
  }

  @Get('xyu')
  @Roles(Role.Reader)
  async xyu(): Promise<any[]> {
    return this.catsService.xyu();
  }
}
