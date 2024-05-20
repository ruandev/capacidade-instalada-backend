import { IsString } from 'class-validator';

export class CreateNucleoDto {
  @IsString()
  nome: string;
}
