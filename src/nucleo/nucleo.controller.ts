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
import { NucleoService } from './nucleo.service';
import { CreateNucleoDto } from './dto/create-nucleo.dto';
import { UpdateNucleoDto } from './dto/update-nucleo.dto';
import { HasRoles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import { RolesGuard } from '../auth/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { EscolaService } from '../escola/escola.service';

@Controller('nucleos')
export class NucleoController {
  constructor(
    private readonly nucleoService: NucleoService,
    private readonly escolaService: EscolaService,
  ) {}

  @Get()
  @HasRoles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.nucleoService.findAll();
  }

  @Get(':id')
  @HasRoles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.nucleoService.findOne(id);
  }

  @Get(':id/escolas')
  @HasRoles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  findEscolasByNucleo(@Param('id') id: string) {
    return this.escolaService.findEscolasByNucleo(id);
  }

  @Post()
  @HasRoles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  create(@Body() createNucleoDto: CreateNucleoDto) {
    return this.nucleoService.create(createNucleoDto);
  }

  @Patch(':id')
  @HasRoles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateNucleoDto: UpdateNucleoDto) {
    return this.nucleoService.update(id, updateNucleoDto);
  }

  @Put(':id/deactivate')
  @HasRoles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  deactivate(@Param('id') id: string) {
    return this.nucleoService.deactivate(id);
  }
}
