import { Injectable } from '@nestjs/common';
import { CreateSerieDto } from './dto/create-serie.dto';
import { UpdateSerieDto } from './dto/update-serie.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Serie } from './entities/serie.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SerieService {
  constructor(
    @InjectRepository(Serie)
    private serieRepository: Repository<Serie>,
  ) {}

  async create(createSerieDto: CreateSerieDto) {
    const serie = new Serie();

    serie.nome = createSerieDto.nome;

    return await this.serieRepository.save(serie);
  }

  async findAll() {
    return await this.serieRepository.find();
  }

  async findAllActives() {
    return await this.serieRepository.find({ where: { ativo: true } });
  }

  async findOne(id: string) {
    return await this.serieRepository.findOneByOrFail({ id });
  }

  async update(id: string, updateSerieDto: UpdateSerieDto) {
    const serie = new Serie();

    serie.nome = updateSerieDto.nome;
    await this.serieRepository.update({ id }, serie);

    return await this.serieRepository.findOneByOrFail({ id });
  }

  async deactivate(id: string) {
    await this.serieRepository.update({ id }, { ativo: false });

    return await this.serieRepository.findOneByOrFail({ id });
  }
}
