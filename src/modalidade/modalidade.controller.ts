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
import { ModalidadeService } from './modalidade.service';
import { CreateModalidadeDto } from './dto/create-modalidade.dto';
import { UpdateModalidadeDto } from './dto/update-modalidade.dto';
import { HasRoles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import { RolesGuard } from '../auth/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('modalidade')
export class ModalidadeController {
  constructor(private readonly modalidadeService: ModalidadeService) {}

  @Get()
  findAll() {
    return this.modalidadeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.modalidadeService.findOne(id);
  }

  @Post()
  @HasRoles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  create(@Body() createModalidadeDto: CreateModalidadeDto) {
    return this.modalidadeService.create(createModalidadeDto);
  }

  @Patch(':id')
  @HasRoles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateModalidadeDto: UpdateModalidadeDto,
  ) {
    return this.modalidadeService.update(id, updateModalidadeDto);
  }

  @Put(':id/deactivate')
  @HasRoles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  deactivate(@Param('id') id: string) {
    return this.modalidadeService.deactivate(id);
  }
}
