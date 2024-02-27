import { Injectable } from '@nestjs/common';
import { CreateHistoricoAlteracaoDto } from './dto/create-historico-alteracao.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { HistoricoAlteracao } from './entities/historico-alteracao.entity';
import { Repository } from 'typeorm';
import { Usuario } from '../usuario/entities/usuario.entity';
import { Sala } from '../sala/entities/sala.entity';

@Injectable()
export class HistoricoAlteracaoService {
  constructor(
    @InjectRepository(HistoricoAlteracao)
    private historicoAlteracaoRepository: Repository<HistoricoAlteracao>,
  ) {}

  async create({
    usuario_id,
    sala_id,
    campo,
    valorAntigo,
    valorNovo,
    flow_id,
  }: CreateHistoricoAlteracaoDto) {
    const historicoAlteracao = new HistoricoAlteracao();

    historicoAlteracao.campo = campo;
    historicoAlteracao.valorAntigo = valorAntigo;
    historicoAlteracao.valorNovo = valorNovo;
    historicoAlteracao.usuario = Usuario.comId(usuario_id);
    historicoAlteracao.sala = Sala.comId(sala_id);
    historicoAlteracao.flowId = flow_id;

    const result = await this.historicoAlteracaoRepository.upsert(
      historicoAlteracao,
      {
        conflictPaths: ['flowId'],
        skipUpdateIfNoValuesChanged: true,
      },
    );

    return result.generatedMaps[0];
  }

  async findAll() {
    return await this.historicoAlteracaoRepository.find();
  }

  async findBySala(id: string) {
    return await this.historicoAlteracaoRepository.findBy({ sala: { id } });
  }

  async findByUsuario(id: string) {
    return await this.historicoAlteracaoRepository.findBy({ usuario: { id } });
  }
}
