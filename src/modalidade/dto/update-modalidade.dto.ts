import { PartialType } from '@nestjs/mapped-types';
import { CreateModalidadeDto } from './create-modalidade.dto';
import { IsBoolean, IsString } from 'class-validator';

export class UpdateModalidadeDto extends PartialType(CreateModalidadeDto) {
  @IsString()
  nome?: string;

  @IsBoolean()
  ativo?: boolean;
}
