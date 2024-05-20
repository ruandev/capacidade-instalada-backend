import { IsString } from 'class-validator';
import { Role } from '../../auth/role.enum';

export class CreateUsuarioDto {
  @IsString()
  nome: string;

  @IsString()
  cpf: string;

  @IsString()
  role: Role;

  @IsString()
  password: string;
}
