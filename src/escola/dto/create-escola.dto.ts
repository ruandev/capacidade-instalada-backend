import { IsString } from 'class-validator';

export class CreateEscolaDto {
  @IsString()
  nome: string;

  @IsString()
  diretora: string;

  @IsString()
  vicediretora?: string;

  @IsString()
  coordenadora: string;

  @IsString()
  secretaria: string;

  @IsString()
  nucleo_id: string;
  modalidades_id: string[];
}
