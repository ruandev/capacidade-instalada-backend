import { Injectable } from '@nestjs/common';
import { CreateModalidadeDto } from './dto/create-Modalidade.dto';
import { UpdateModalidadeDto } from './dto/update-Modalidade.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Modalidade } from './entities/modalidade.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ModalidadeService {
  constructor(
    @InjectRepository(Modalidade)
    private modalidadeRepository: Repository<Modalidade>,
  ) {}

  async create(createModalidadeDto: CreateModalidadeDto) {
    const modalidade = new Modalidade();

    modalidade.nome = createModalidadeDto.nome;

    return await this.modalidadeRepository.save(modalidade);
  }

  async findAll() {
    return await this.modalidadeRepository.find();
  }

  async findAllActives() {
    return await this.modalidadeRepository.find({ where: { ativo: true } });
  }

  async findOne(id: string) {
    return await this.modalidadeRepository.findOneByOrFail({ id });
  }

  async update(id: string, updateModalidadeDto: UpdateModalidadeDto) {
    const modalidade = new Modalidade();

    modalidade.nome = updateModalidadeDto.nome;
    await this.modalidadeRepository.update({ id }, modalidade);

    return await this.modalidadeRepository.findOneByOrFail({ id });
  }

  async deactivate(id: string) {
    await this.modalidadeRepository.update({ id }, { ativo: false });

    return await this.modalidadeRepository.findOneByOrFail({ id });
  }
}
