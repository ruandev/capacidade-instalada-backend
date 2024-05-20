import { Injectable } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Usuario } from './entities/usuario.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { stringToRole } from '../auth/role.enum';
import * as bcrypt from 'bcrypt-updated';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
  ) {}

  async create({ nome, cpf, role, password }: CreateUsuarioDto) {
    const usuario: Usuario = new Usuario();

    usuario.nome = nome;
    usuario.cpf = cpf;
    usuario.role = stringToRole(role);
    usuario.password = bcrypt.hashSync(password, 10);

    return await this.usuarioRepository.save(usuario);
  }

  async findAll() {
    return await this.usuarioRepository.find({
      select: ['id', 'nome', 'cpf', 'role', 'ativo'],
    });
  }

  async findOne(id: string) {
    return await this.usuarioRepository.findOneByOrFail({ id });
  }

  async update(id: string, { nome, cpf, password }: UpdateUsuarioDto) {
    const usuario = new Usuario();

    usuario.nome = nome;
    usuario.cpf = cpf;

    if (password) {
      usuario.password = await bcrypt.hash(password, 10);
    }

    await this.usuarioRepository.update(id, usuario);

    return await this.usuarioRepository.findOneByOrFail({ id });
  }

  async findByCPF(cpf: string) {
    return await this.usuarioRepository.findOneByOrFail({ cpf });
  }

  async deactivate(id: string) {
    await this.usuarioRepository.update({ id }, { ativo: false });

    return await this.usuarioRepository.findOneByOrFail({ id });
  }
}
