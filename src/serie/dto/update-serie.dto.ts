import { PartialType } from '@nestjs/mapped-types';
import { CreateSerieDto } from './create-serie.dto';
import { IsBoolean, IsString } from 'class-validator';

export class UpdateSerieDto extends PartialType(CreateSerieDto) {
  @IsString()
  nome?: string;

  @IsBoolean()
  ativo?: boolean;
}
