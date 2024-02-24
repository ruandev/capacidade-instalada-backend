import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SalaService } from './sala.service';
import { Sala } from './entities/sala.entity';
import { CreateSalaDto } from './dto/create-sala.dto';
import { Turno } from './entities/turno.enum';
import { Escola } from '../escola/entities/escola.entity';
import { Serie } from '../serie/entities/serie.entity';
import { UpdateSalaDto } from './dto/update-sala.dto';
import { KafkaProducerService } from '../kafka/producer.service';

const createSalaDto: CreateSalaDto = {
  numero: 1,
  turno: 'matutino',
  capacidade: 25,
  matriculaInicial: 20,
  especiais: 0,
  matriculaCancelada: 2,
  transferidos: 5,
  evadidos: 1,
  matriculaEfetiva: 10,
  naoRenovaram: 2,
  intraRede: 1,
  projecao: 15,
  professorPrincipal: 'Maria',
  escola_id: '123',
  serie_id: '123',
};
const expectedSala: Sala = {
  id: '1',
  numero: 1,
  turno: Turno.MATUTINO,
  capacidade: 25,
  matriculaInicial: 20,
  especiais: 0,
  matriculaCancelada: 2,
  transferidos: 5,
  evadidos: 1,
  matriculaEfetiva: 10,
  naoRenovaram: 2,
  intraRede: 1,
  projecao: 15,
  professorPrincipal: 'Maria',
  escola: Escola.comId('123'),
  serie: Serie.comId('123'),
  ativo: true,
  updatedAt: new Date(),
};

describe('SalaService', () => {
  let service: SalaService;

  let salaRepository: Repository<Sala>;

  let kafkaProducerService: Partial<KafkaProducerService>;

  beforeEach(async () => {
    kafkaProducerService = {
      sendMessageToHistoricoAlteracao: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SalaService,
        {
          provide: getRepositoryToken(Sala),
          useClass: Repository,
        },
        {
          provide: KafkaProducerService,
          useValue: kafkaProducerService,
        },
      ],
    }).compile();

    service = module.get<SalaService>(SalaService);
    salaRepository = module.get<Repository<Sala>>(getRepositoryToken(Sala));
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('create', () => {
    it('should create a new sala', async () => {
      jest.spyOn(salaRepository, 'save').mockResolvedValue(expectedSala);

      const result = await service.create(createSalaDto);

      expect(result).toEqual(expectedSala);
    });
  });
  describe('findAll', () => {
    it('should return all salas', async () => {
      const expectedSalas = [expectedSala];

      jest.spyOn(salaRepository, 'find').mockResolvedValue(expectedSalas);

      const result = await service.findAll();

      expect(result).toEqual(expectedSalas);
    });
  });
  describe('findOne', () => {
    it('should return one sala', async () => {
      const salaId = '1';

      jest
        .spyOn(salaRepository, 'findOneByOrFail')
        .mockResolvedValue(expectedSala);

      const result = await service.findOne(salaId);

      expect(result).toEqual(expectedSala);
    });
  });
  describe('update', () => {
    it('should update sala and create historico de alteracao', async () => {
      const id = '1';
      const userId = 'user1';
      const updateSalaDto: UpdateSalaDto = {
        capacidade: 99,
      };

      jest
        .spyOn(salaRepository, 'findOneByOrFail')
        .mockResolvedValueOnce(expectedSala)
        .mockResolvedValue({ ...expectedSala, capacidade: 99 });
      jest.spyOn(salaRepository, 'update').mockResolvedValue(undefined);
      await service.update(id, updateSalaDto, userId);
      expect(salaRepository.findOneByOrFail).toHaveBeenCalledWith({ id });
      expect(salaRepository.update).toHaveBeenCalledWith(id, expect.any(Sala));
      expect(
        kafkaProducerService.sendMessageToHistoricoAlteracao,
      ).toHaveBeenCalledTimes(1);
      expect(
        kafkaProducerService.sendMessageToHistoricoAlteracao,
      ).toHaveBeenCalledWith({
        campo: 'capacidade',
        valorAntigo: 25,
        valorNovo: 99,
        usuario_id: userId,
        sala_id: id,
        flow_id: expect.any(String),
      });
    });
    it('should not create historico de alteracao when sala is not updated', async () => {
      const id = '1';
      const userId = 'user1';
      const updateSalaDto: UpdateSalaDto = {
        capacidade: expectedSala.capacidade,
      };

      jest
        .spyOn(salaRepository, 'findOneByOrFail')
        .mockResolvedValue(expectedSala);
      jest.spyOn(salaRepository, 'update').mockResolvedValue(undefined);
      await service.update(id, updateSalaDto, userId);
      expect(salaRepository.findOneByOrFail).toHaveBeenCalledWith({ id });
      expect(salaRepository.update).toHaveBeenCalledWith(id, expect.any(Sala));
      expect(
        kafkaProducerService.sendMessageToHistoricoAlteracao,
      ).not.toHaveBeenCalled();
    });
  });
  describe('deactivate', () => {
    it('should deactivate a sala', async () => {
      const salaId = '1';
      const expectedInactiveSala = { ...expectedSala, active: false };

      jest.spyOn(salaRepository, 'update').mockResolvedValue(undefined);
      jest
        .spyOn(salaRepository, 'findOneByOrFail')
        .mockResolvedValue(expectedInactiveSala);

      const result = await service.deactivate(salaId);

      expect(result).toEqual(expectedInactiveSala);
    });
  });
});
