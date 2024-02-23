import { Injectable } from '@nestjs/common';
import { CreateSalaDto } from './dto/create-sala.dto';
import { UpdateSalaDto } from './dto/update-sala.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Sala } from './entities/sala.entity';
import { Repository } from 'typeorm';
import { stringToTurno } from './entities/turno.enum';
import { Escola } from '../escola/entities/escola.entity';
import { Serie } from '../serie/entities/serie.entity';
import { CreateHistoricoAlteracaoDto } from '../historico-alteracao/dto/create-historico-alteracao.dto';
import { HistoricoAlteracaoService } from '../historico-alteracao/historico-alteracao.service';

@Injectable()
export class SalaService {
  constructor(
    @InjectRepository(Sala)
    private salaRepository: Repository<Sala>,
    private readonly historicoAlteracaoService: HistoricoAlteracaoService,
  ) {}

  async create(createSalaDto: CreateSalaDto) {
    const sala = new Sala();
    const escola = new Escola();
    const serie = new Serie();

    escola.id = createSalaDto.escola_id;
    serie.id = createSalaDto.serie_id;
    sala.escola = escola;
    sala.serie = serie;
    sala.numero = createSalaDto.numero;
    sala.turno = stringToTurno(createSalaDto.turno);
    sala.capacidade = createSalaDto.capacidade;
    sala.matriculaInicial = createSalaDto.matriculaInicial;
    sala.especiais = createSalaDto.especiais;
    sala.matriculaCancelada = createSalaDto.matriculaCancelada;
    sala.transferidos = createSalaDto.transferidos;
    sala.evadidos = createSalaDto.evadidos;
    sala.matriculaEfetiva = createSalaDto.matriculaEfetiva;
    sala.naoRenovaram = createSalaDto.naoRenovaram;
    sala.intraRede = createSalaDto.intraRede;
    sala.projecao = createSalaDto.projecao;
    sala.professorPrincipal = createSalaDto.professorPrincipal;
    sala.professorSecundario = createSalaDto.professorSecundario;

    return await this.salaRepository.save(sala);
  }

  async findAll() {
    return await this.salaRepository.find();
  }

  async findOne(id: string) {
    return await this.salaRepository.findOneByOrFail({ id });
  }

  async update(id: string, updateSalaDto: UpdateSalaDto, userId: string) {
    const sala = new Sala();
    const escola = new Escola();
    const serie = new Serie();
    const atualSala = await this.salaRepository.findOneByOrFail({ id });

    escola.id = updateSalaDto.escola_id;
    serie.id = updateSalaDto.serie_id;
    sala.escola = escola;
    sala.serie = serie;
    sala.numero = updateSalaDto.numero;
    sala.turno = stringToTurno(updateSalaDto.turno);
    sala.capacidade = updateSalaDto.capacidade;
    sala.matriculaInicial = updateSalaDto.matriculaInicial;
    sala.especiais = updateSalaDto.especiais;
    sala.matriculaCancelada = updateSalaDto.matriculaCancelada;
    sala.transferidos = updateSalaDto.transferidos;
    sala.evadidos = updateSalaDto.evadidos;
    sala.matriculaEfetiva = updateSalaDto.matriculaEfetiva;
    sala.naoRenovaram = updateSalaDto.naoRenovaram;
    sala.intraRede = updateSalaDto.intraRede;
    sala.projecao = updateSalaDto.projecao;
    sala.professorPrincipal = updateSalaDto.professorPrincipal;
    sala.professorSecundario = updateSalaDto.professorSecundario;
    await this.salaRepository.update(id, sala);

    const salaAtualizada = await this.salaRepository.findOneByOrFail({ id });
    const alteracoes: CreateHistoricoAlteracaoDto[] = [];

    Object.keys(atualSala).forEach((campo) => {
      if (atualSala[campo] !== salaAtualizada[campo]) {
        alteracoes.push({
          campo: campo,
          valorAntigo: atualSala[campo],
          valorNovo: salaAtualizada[campo],
          usuario_id: userId,
          sala_id: id,
        });
      }
    });
    alteracoes.forEach(async (alteracao) => {
      await this.historicoAlteracaoService.create(alteracao);
    });

    return salaAtualizada;
  }

  async deactivate(id: string) {
    await this.salaRepository.update({ id }, { ativo: false });

    return await this.salaRepository.findOneByOrFail({ id });
  }
}
