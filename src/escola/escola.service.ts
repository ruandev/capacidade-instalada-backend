import { Injectable } from '@nestjs/common';
import { CreateEscolaDto } from './dto/create-escola.dto';
import { UpdateEscolaDto } from './dto/update-escola.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Escola } from './entities/escola.entity';
import { Repository } from 'typeorm';
import { Nucleo } from '../nucleo/entities/nucleo.entity';
import { Modalidade } from '../modalidade/entities/modalidade.entity';

@Injectable()
export class EscolaService {
  constructor(
    @InjectRepository(Escola)
    private escolaRepository: Repository<Escola>,
  ) {}

  async create({
    nome,
    diretora,
    vicediretora,
    coordenadora,
    secretaria,
    nucleo_id,
    modalidades_id,
  }: CreateEscolaDto) {
    const escola = new Escola();

    escola.nome = nome;
    escola.diretora = diretora;
    escola.vicediretora = vicediretora;
    escola.coordenadora = coordenadora;
    escola.secretaria = secretaria;
    escola.nucleo = Nucleo.comId(nucleo_id);
    escola.modalidades = [];

    for (const modalidade_id of modalidades_id) {
      escola.modalidades.push(Modalidade.comId(modalidade_id));
    }

    return await this.escolaRepository.save(escola);
  }

  async findAll() {
    return await this.escolaRepository.find();
  }

  async findAllActives() {
    return await this.escolaRepository.find({ where: { ativo: true } });
  }

  async findOne(id: string) {
    return await this.escolaRepository.findOneByOrFail({ id });
  }

  async update(
    id: string,
    {
      nome,
      diretora,
      vicediretora,
      coordenadora,
      secretaria,
      nucleo_id,
    }: UpdateEscolaDto,
  ) {
    const escola = new Escola();

    escola.nome = nome;
    escola.diretora = diretora;
    escola.vicediretora = vicediretora;
    escola.coordenadora = coordenadora;
    escola.secretaria = secretaria;

    if (nucleo_id) {
      escola.nucleo = Nucleo.comId(nucleo_id);
    }

    await this.escolaRepository.update({ id }, escola);

    return await this.escolaRepository.findOneByOrFail({ id });
  }

  async deactivate(id: string) {
    await this.escolaRepository.update({ id }, { ativo: false });

    return await this.escolaRepository.findOneByOrFail({ id });
  }

  async findEscolasByNucleo(id: string) {
    return await this.escolaRepository.find({
      where: { nucleo: { id } },
    });
  }
}
