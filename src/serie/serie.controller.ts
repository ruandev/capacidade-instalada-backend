import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { SerieService } from './serie.service';
import { CreateSerieDto } from './dto/create-serie.dto';
import { UpdateSerieDto } from './dto/update-serie.dto';
import { HasRoles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import { RolesGuard } from '../auth/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('serie')
export class SerieController {
  constructor(private readonly serieService: SerieService) {}

  @Get()
  findAll() {
    return this.serieService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.serieService.findOne(id);
  }

  @Post()
  @HasRoles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  create(@Body() createSerieDto: CreateSerieDto) {
    return this.serieService.create(createSerieDto);
  }

  @Patch(':id')
  @HasRoles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateSerieDto: UpdateSerieDto) {
    return this.serieService.update(id, updateSerieDto);
  }

  @Put(':id/deactivate')
  @HasRoles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  deactivate(@Param('id') id: string) {
    return this.serieService.deactivate(id);
  }
}
