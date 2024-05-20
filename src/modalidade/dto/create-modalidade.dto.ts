import { IsString } from 'class-validator';

export class CreateModalidadeDto {
  @IsString()
  nome: string;
}
