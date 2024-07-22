import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Put,
  UseGuards,
  Query,
  DefaultValuePipe,
  ParseBoolPipe,
  UseInterceptors,
} from '@nestjs/common';
import { ModalidadeService } from './modalidade.service';
import { CreateModalidadeDto } from './dto/create-modalidade.dto';
import { UpdateModalidadeDto } from './dto/update-modalidade.dto';
import { HasRoles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import { RolesGuard } from '../auth/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CacheInterceptor, CacheKey } from '@nestjs/cache-manager';

@Controller('modalidades')
export class ModalidadeController {
  counter = 0;
  constructor(private readonly modalidadeService: ModalidadeService) {}

  @Get()
  @UseInterceptors(CacheInterceptor)
  @CacheKey('modalidades')
  @HasRoles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  findAll(
    @Query('ativos', new DefaultValuePipe(false), ParseBoolPipe)
    ativos: boolean,
  ) {
    if (ativos) {
      return this.modalidadeService.findAllActives();
    }

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

  @Put(':id/activate')
  @HasRoles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  activate(@Param('id') id: string) {
    return this.modalidadeService.activate(id);
  }
}
