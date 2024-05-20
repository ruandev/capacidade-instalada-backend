import { Injectable } from '@nestjs/common';
import { CreateNucleoDto } from './dto/create-nucleo.dto';
import { UpdateNucleoDto } from './dto/update-nucleo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Nucleo } from './entities/nucleo.entity';
import { Repository } from 'typeorm';

@Injectable()
export class NucleoService {
  constructor(
    @InjectRepository(Nucleo)
    private nucleoRepository: Repository<Nucleo>,
  ) {}

  async create(createNucleoDto: CreateNucleoDto) {
    const nucleo = new Nucleo();

    nucleo.nome = createNucleoDto.nome;

    return await this.nucleoRepository.save(nucleo);
  }

  async findAll() {
    return await this.nucleoRepository.find();
  }

  async findAllActives() {
    return await this.nucleoRepository.find({ where: { ativo: true } });
  }

  async findOne(id: string) {
    return await this.nucleoRepository.findOneByOrFail({ id });
  }

  async update(id: string, updateNucleoDto: UpdateNucleoDto) {
    const nucleo = new Nucleo();

    nucleo.nome = updateNucleoDto.nome;
    await this.nucleoRepository.update({ id }, nucleo);

    return await this.nucleoRepository.findOneByOrFail({ id });
  }

  async deactivate(id: string) {
    await this.nucleoRepository.update({ id }, { ativo: false });

    return await this.nucleoRepository.findOneByOrFail({ id });
  }
}
