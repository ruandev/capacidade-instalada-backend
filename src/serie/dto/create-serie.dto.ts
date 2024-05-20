import { IsString } from 'class-validator';

export class CreateSerieDto {
  @IsString()
  nome: string;
}
