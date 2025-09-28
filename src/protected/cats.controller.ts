import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';

import { Roles } from '@/iam/decorators/roles.decorator';
import { RolesGuard } from '@/iam/guards/roles/roles.guard';
import { Role } from '@/iam/enums/roles.enum';
import { CatsService } from '@/protected/cats.service';
import { CreateCatDto } from '@/protected/dto/create-cat.dto';
import { GeolocationDto } from '@/protected/dto/geolocation.dto'

@UseGuards(RolesGuard)
@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Post()
  @Roles(Role.Customer)
  create(@Body() createCatDto: CreateCatDto) {
    this.catsService.create(createCatDto);
  }

  // @Param('id', new ParseIntPipe())
  @Get(':id')
  findOne(id: number) {
    console.log(id);
  }

  @Get('xyu')
  @Roles(Role.Customer)
  async xyu(@Query() query: GeolocationDto): Promise<any[]> {
    return this.catsService.xyu(query);
  }
}
