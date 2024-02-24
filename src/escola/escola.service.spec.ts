import { EscolaService } from './escola.service';
import { Repository } from 'typeorm';
import { Escola } from './entities/escola.entity';
import { CreateEscolaDto } from './dto/create-escola.dto';
import { UpdateEscolaDto } from './dto/update-escola.dto';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('EscolaService', () => {
  let service: EscolaService;

  let repository: Repository<Escola>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EscolaService,
        {
          provide: getRepositoryToken(Escola),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<EscolaService>(EscolaService);
    repository = module.get<Repository<Escola>>(getRepositoryToken(Escola));
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('create', () => {
    it('should create a new school with vicediretora', async () => {
      const createDto: CreateEscolaDto = {
        nome: 'Escola Teste',
        diretora: 'Diretora Teste',
        vicediretora: 'Vice-Diretora Teste',
        coordenadora: 'Coordenadora Teste',
        secretaria: 'Secretaria Teste',
        nucleo_id: 'nucleo-id',
        modalidades_id: ['modalidade-id-1', 'modalidade-id-2'],
      };
      const mockSavedEscola = new Escola();

      jest.spyOn(repository, 'save').mockResolvedValueOnce(mockSavedEscola);

      const result = await service.create(createDto);

      expect(result).toEqual(mockSavedEscola);
    });
    it('should create a new school without vicediretora', async () => {
      const createDto: CreateEscolaDto = {
        nome: 'Escola Teste',
        diretora: 'Diretora Teste',
        coordenadora: 'Coordenadora Teste',
        secretaria: 'Secretaria Teste',
        nucleo_id: 'nucleo-id',
        modalidades_id: ['modalidade-id-1', 'modalidade-id-2'],
      };
      const mockSavedEscola = new Escola();

      jest.spyOn(repository, 'save').mockResolvedValueOnce(mockSavedEscola);

      const result = await service.create(createDto);

      expect(result).toEqual(mockSavedEscola);
    });
  });
  describe('findAll', () => {
    it('should return all schools', async () => {
      const mockSchools = [new Escola(), new Escola()];

      jest.spyOn(repository, 'find').mockResolvedValueOnce(mockSchools);

      const result = await service.findAll();

      expect(result).toEqual(mockSchools);
    });
  });
  describe('findAllActives', () => {
    it('should return all active schools', async () => {
      const mockActiveSchools = [new Escola(), new Escola()];

      jest.spyOn(repository, 'find').mockResolvedValueOnce(mockActiveSchools);

      const result = await service.findAllActives();

      expect(result).toEqual(mockActiveSchools);
    });
  });
  describe('findOne', () => {
    it('should return one school by id', async () => {
      const id = 'school-id';
      const mockSchool = new Escola();

      jest
        .spyOn(repository, 'findOneByOrFail')
        .mockResolvedValueOnce(mockSchool);

      const result = await service.findOne(id);

      expect(result).toEqual(mockSchool);
    });
  });
  describe('update', () => {
    it('should update a school', async () => {
      const id = 'school-id';
      const updateDto: UpdateEscolaDto = {
        nome: 'Escola Atualizada',
        diretora: 'Nova Diretora',
        vicediretora: 'Nova Vice-Diretora',
        coordenadora: 'Nova Coordenadora',
        secretaria: 'Nova Secretaria',
        nucleo_id: 'nucleo-id',
      };
      const mockUpdatedSchool = new Escola();

      jest.spyOn(repository, 'update').mockResolvedValueOnce(undefined);
      jest
        .spyOn(repository, 'findOneByOrFail')
        .mockResolvedValueOnce(mockUpdatedSchool);

      const result = await service.update(id, updateDto);

      expect(result).toEqual(mockUpdatedSchool);
    });
  });
  describe('deactivate', () => {
    it('should deactivate a school', async () => {
      const id = 'school-id';
      const mockDeactivatedSchool = new Escola();

      jest.spyOn(repository, 'update').mockResolvedValueOnce(undefined);
      jest
        .spyOn(repository, 'findOneByOrFail')
        .mockResolvedValueOnce(mockDeactivatedSchool);

      const result = await service.deactivate(id);

      expect(result).toEqual(mockDeactivatedSchool);
    });
  });
  describe('findEscolasByNucleo', () => {
    it('should return all schools associated with a given nucleo', async () => {
      const mockNucleoId = 'nucleo-id';
      const mockEscolas = [new Escola(), new Escola()];

      jest.spyOn(repository, 'find').mockResolvedValueOnce(mockEscolas);

      const result = await service.findEscolasByNucleo(mockNucleoId);

      expect(result).toEqual(mockEscolas);
      expect(repository.find).toHaveBeenCalledWith({
        where: { nucleo: { id: mockNucleoId } },
      });
    });
    it('should return an empty array if no schools are associated with the given nucleo', async () => {
      const mockNucleoId = 'non-existent-nucleo-id';

      jest.spyOn(repository, 'find').mockResolvedValueOnce([]);

      const result = await service.findEscolasByNucleo(mockNucleoId);

      expect(result).toEqual([]);
      expect(repository.find).toHaveBeenCalledWith({
        where: { nucleo: { id: mockNucleoId } },
      });
    });
  });
});
