import { IsNumber, IsString } from 'class-validator';

export class CreateSalaDto {
  @IsNumber()
  numero: number;

  @IsString()
  turno: string;

  @IsNumber()
  capacidade: number;

  @IsNumber()
  matriculaInicial: number;

  @IsNumber()
  especiais: number;

  @IsNumber()
  matriculaCancelada: number;

  @IsNumber()
  transferidos: number;

  @IsNumber()
  evadidos: number;

  @IsNumber()
  matriculaEfetiva: number;

  @IsNumber()
  naoRenovaram: number;

  @IsNumber()
  intraRede: number;

  @IsNumber()
  projecao: number;

  @IsString()
  professorPrincipal: string;

  @IsString()
  professorSecundario?: string;

  @IsString()
  escola_id: string;

  @IsString()
  serie_id: string;
}
