import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsuarioService } from '../usuario/usuario.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt-updated';
import { Usuario } from '../usuario/entities/usuario.entity';

@Injectable()
export class AuthService {
  constructor(
    private usuarioService: UsuarioService,
    private jwtService: JwtService,
  ) {}

  async validateUser(cpf: string, pass: string): Promise<any> {
    try {
      const user: Usuario = await this.usuarioService.findByCPF(cpf);

      if (!user) {
        throw new UnauthorizedException();
      }

      const passValidation = bcrypt.compareSync(pass, user.password);

      if (!passValidation) {
        throw new UnauthorizedException();
      }

      const payload = {
        nome: user.nome,
        sub: user.id,
        role: user.role,
      };

      return {
        user: { id: user.id, nome: user.nome, role: user.role },
        access_token: this.jwtService.sign(payload),
      };
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
