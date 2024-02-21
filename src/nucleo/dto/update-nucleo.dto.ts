import { PartialType } from '@nestjs/mapped-types';
import { CreateNucleoDto } from './create-nucleo.dto';
import { IsBoolean, IsString } from 'class-validator';

export class UpdateNucleoDto extends PartialType(CreateNucleoDto) {
  @IsString()
  nome?: string;

  @IsBoolean()
  ativo?: boolean;
}
