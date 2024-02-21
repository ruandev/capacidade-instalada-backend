import { Injectable } from '@nestjs/common';
import { CreateEscolaDto } from './dto/create-escola.dto';
import { UpdateEscolaDto } from './dto/update-escola.dto';

@Injectable()
export class EscolaService {
  create(createEscolaDto: CreateEscolaDto) {
    return 'This action adds a new escola';
  }

  findAll() {
    return `This action returns all escola`;
  }

  findOne(id: string) {
    return `This action returns a #${id} escola`;
  }

  update(id: string, updateEscolaDto: UpdateEscolaDto) {
    return `This action updates a #${id} escola`;
  }

  remove(id: string) {
    return `This action removes a #${id} escola`;
  }
}
