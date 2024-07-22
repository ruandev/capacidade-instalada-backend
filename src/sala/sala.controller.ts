import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Put,
  UseGuards,
  Request,
} from '@nestjs/common';
import { SalaService } from './sala.service';
import { CreateSalaDto } from './dto/create-sala.dto';
import { UpdateSalaDto } from './dto/update-sala.dto';
import { HasRoles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import { RolesGuard } from '../auth/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('salas')
export class SalaController {
  constructor(private readonly salaService: SalaService) {}

  @Get()
  findAll() {
    return this.salaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.salaService.findOne(id);
  }

  @Post()
  @HasRoles(Role.ADMIN, Role.SECRETARIA)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  create(@Body() createSalaDto: CreateSalaDto) {
    return this.salaService.create(createSalaDto);
  }

  @Patch(':id')
  @HasRoles(Role.ADMIN, Role.SECRETARIA)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateSalaDto: UpdateSalaDto,
    @Request() req: any,
  ) {
    return this.salaService.update(id, updateSalaDto, req.user.userId);
  }

  @Put(':id/toggle-status')
  @HasRoles(Role.ADMIN, Role.SECRETARIA)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  deactivate(@Param('id') id: string) {
    return this.salaService.toggleStatus(id);
  }

  @Get(':id/historic')
  @HasRoles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  historic(@Param('id') id: string) {
    return this.salaService.historic(id);
  }
}
