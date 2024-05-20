import { Test, TestingModule } from '@nestjs/testing';
import { EscolaController } from './escola.controller';
import { EscolaService } from './escola.service';
import { CreateEscolaDto } from './dto/create-escola.dto';
import { UpdateEscolaDto } from './dto/update-escola.dto';
import { Escola } from './entities/escola.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('EscolaController', () => {
  let controller: EscolaController;

  let service: EscolaService;

  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      controllers: [EscolaController],
      providers: [
        EscolaService,
        {
          provide: getRepositoryToken(Escola),
          useClass: Repository,
        },
      ],
    }).compile();
    controller = module.get<EscolaController>(EscolaController);
    service = module.get<EscolaService>(EscolaService);
  });
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('findOne', () => {
    it('should call findOne from service and return result', async () => {
      const mockId = 'mock-id';
      const mockResult = new Escola();

      jest.spyOn(service, 'findOne').mockResolvedValueOnce(mockResult);

      const result = await controller.findOne(mockId);

      expect(result).toBe(mockResult);
      expect(service.findOne).toHaveBeenCalledWith(mockId);
    });
  });
  describe('create', () => {
    it('should call create from service and return result', async () => {
      const mockCreateEscolaDto: CreateEscolaDto = {
        nome: 'Escola Teste',
        diretora: 'Diretora Teste',
        coordenadora: 'Coordenadora Teste',
        secretaria: 'Secretaria Teste',
        nucleo_id: 'nucleo-id',
        modalidades_id: ['modalidade-id-1', 'modalidade-id-2'],
      };
      const mockResult = new Escola();

      jest.spyOn(service, 'create').mockResolvedValueOnce(mockResult);
      await controller.create(mockCreateEscolaDto);
      expect(service.create).toHaveBeenCalledWith(mockCreateEscolaDto);
    });
  });
  describe('findAll', () => {
    it('should call findAll from service and return result', async () => {
      const mockResult = [new Escola()];

      jest.spyOn(service, 'findAll').mockResolvedValueOnce(mockResult);

      const result = await controller.findAll();

      expect(result).toBe(mockResult);
      expect(service.findAll).toHaveBeenCalled();
    });
  });
  describe('update', () => {
    it('should call update from service and return result', async () => {
      const mockId = 'mock-id';
      const mockUpdateEscolaDto: UpdateEscolaDto = { nome: 'Escola Teste' };

      jest.spyOn(service, 'update').mockResolvedValueOnce(new Escola());
      await controller.update(mockId, mockUpdateEscolaDto);
      expect(service.update).toHaveBeenCalledWith(mockId, mockUpdateEscolaDto);
    });
  });
  describe('remove', () => {
    it('should call deactivate from service and return result', async () => {
      const mockId = 'mock-id';
      const mockResult = new Escola();

      mockResult.ativo = false;
      jest.spyOn(service, 'deactivate').mockResolvedValueOnce(mockResult);

      const result = await controller.remove(mockId);

      expect(result).toBe(mockResult);
      expect(service.deactivate).toHaveBeenCalledWith(mockId);
    });
  });
});
