import { Inject, Injectable } from '@nestjs/common';
import { CreateModalidadeDto } from './dto/create-modalidade.dto';
import { UpdateModalidadeDto } from './dto/update-modalidade.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Modalidade } from './entities/modalidade.entity';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class ModalidadeService {
  constructor(
    @InjectRepository(Modalidade)
    private modalidadeRepository: Repository<Modalidade>,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  async create(createModalidadeDto: CreateModalidadeDto) {
    const modalidade = new Modalidade();

    modalidade.nome = createModalidadeDto.nome;
    await this.cacheManager.del('modalidades');

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
    await this.cacheManager.del('modalidades');

    return await this.modalidadeRepository.findOneByOrFail({ id });
  }

  async activate(id: string) {
    await this.modalidadeRepository.update({ id }, { ativo: true });
    await this.cacheManager.del('modalidades');

    return await this.modalidadeRepository.findOneByOrFail({ id });
  }
}
