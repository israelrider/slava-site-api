import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';

import { Roles } from '@/iam/login/decorators/roles.decorator';
import { RolesGuard } from '@/iam/login/guards/roles/roles.guard';
import { Role } from '@/iam/login/enums/roles.enum';
import { CatsService } from '@/protected/cats.service';
import { CreateCatDto } from '@/protected/dto/create-cat.dto';
import { Cat } from './interfaces/cat.interface';

@UseGuards(RolesGuard)
@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Post()
  @Roles(Role.Admin)
  async create(@Body() createCatDto: CreateCatDto) {
    this.catsService.create(createCatDto);
  }

  @Get('xyu')
  @Roles(Role.Admin)
  async findAll(): Promise<Cat[]> {
    return this.catsService.findAll();
  }

  @Get(':id')
  findOne(
    // @Param('id', new ParseIntPipe())
    id: number,
  ) {
    // get by ID logic
  }
}
