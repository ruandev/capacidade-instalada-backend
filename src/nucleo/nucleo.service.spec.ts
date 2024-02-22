import { Test, TestingModule } from '@nestjs/testing';
import { NucleoService } from './nucleo.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Nucleo } from './entities/nucleo.entity';
import { CreateNucleoDto } from './dto/create-nucleo.dto';
import { UpdateNucleoDto } from './dto/update-nucleo.dto';

describe('NucleoService', () => {
  let service: NucleoService;

  let repository: Repository<Nucleo>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NucleoService,
        {
          provide: getRepositoryToken(Nucleo),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<NucleoService>(NucleoService);
    repository = module.get<Repository<Nucleo>>(getRepositoryToken(Nucleo));
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('create', () => {
    it('should create a new nucleo', async () => {
      const createNucleoDto: CreateNucleoDto = {
        nome: 'Nucleo 1',
      };
      const nucleo = new Nucleo();

      nucleo.nome = createNucleoDto.nome;
      jest.spyOn(repository, 'save').mockResolvedValue(nucleo);
      expect(await service.create(createNucleoDto)).toEqual(nucleo);
    });
  });
  describe('findAll', () => {
    it('should return all nucleos', async () => {
      const nucleos: Nucleo[] = [
        { id: '1', nome: 'Nucleo 1', ativo: true, escolas: [] },
      ];

      jest.spyOn(repository, 'find').mockResolvedValue(nucleos);
      expect(await service.findAll()).toEqual(nucleos);
    });
  });
  describe('findOne', () => {
    it('should return a nucleo by ID', async () => {
      const nucleo: Nucleo = {
        id: '1',
        nome: 'Nucleo 1',
        ativo: true,
        escolas: [],
      };

      jest.spyOn(repository, 'findOneByOrFail').mockResolvedValue(nucleo);
      expect(await service.findOne('1')).toEqual(nucleo);
    });
  });
  describe('update', () => {
    it('should update a nucleo by ID', async () => {
      const updateNucleoDto: UpdateNucleoDto = { nome: 'Updated Nucleo' };
      const nucleo: Nucleo = {
        id: '1',
        nome: 'Updated Nucleo',
        ativo: true,
        escolas: [],
      };

      jest.spyOn(repository, 'update').mockResolvedValue({} as any);
      jest.spyOn(repository, 'findOneByOrFail').mockResolvedValue(nucleo);
      expect(await service.update('1', updateNucleoDto)).toEqual(nucleo);
    });
  });
  describe('deactivate', () => {
    it('should deactivate a nucleo by ID', async () => {
      const nucleo: Nucleo = {
        id: '1',
        nome: 'Nucleo 1',
        ativo: true,
        escolas: [],
      };
      const deactivatedNucleo = { ...nucleo, ativo: false };

      jest.spyOn(repository, 'update').mockResolvedValue({} as any);
      jest
        .spyOn(repository, 'findOneByOrFail')
        .mockResolvedValue(deactivatedNucleo);
      expect(await service.deactivate('1')).toEqual(deactivatedNucleo);
    });
  });
});
