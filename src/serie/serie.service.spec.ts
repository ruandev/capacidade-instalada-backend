import { Test, TestingModule } from '@nestjs/testing';
import { SerieService } from './serie.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Serie } from './entities/serie.entity';
import { CreateSerieDto } from './dto/create-serie.dto';
import { UpdateSerieDto } from './dto/update-serie.dto';

describe('SerieService', () => {
  let service: SerieService;

  let repository: Repository<Serie>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SerieService,
        {
          provide: getRepositoryToken(Serie),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<SerieService>(SerieService);
    repository = module.get<Repository<Serie>>(getRepositoryToken(Serie));
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('create', () => {
    it('should create a new serie', async () => {
      const createSerieDto: CreateSerieDto = {
        nome: 'Serie 1',
      };
      const serie = new Serie();

      serie.nome = createSerieDto.nome;
      jest.spyOn(repository, 'save').mockResolvedValue(serie);
      expect(await service.create(createSerieDto)).toEqual(serie);
    });
  });
  describe('findAll', () => {
    it('should return all series', async () => {
      const series: Serie[] = [{ id: '1', nome: 'Serie 1', ativo: true }];

      jest.spyOn(repository, 'find').mockResolvedValue(series);
      expect(await service.findAll()).toEqual(series);
    });
  });
  describe('findOne', () => {
    it('should return a serie by ID', async () => {
      const serie: Serie = { id: '1', nome: 'Serie 1', ativo: true };

      jest.spyOn(repository, 'findOneByOrFail').mockResolvedValue(serie);
      expect(await service.findOne('1')).toEqual(serie);
    });
  });
  describe('update', () => {
    it('should update a serie by ID', async () => {
      const updateSerieDto: UpdateSerieDto = { nome: 'Updated Serie' };
      const serie: Serie = { id: '1', nome: 'Updated Serie', ativo: true };

      jest.spyOn(repository, 'update').mockResolvedValue({} as any);
      jest.spyOn(repository, 'findOneByOrFail').mockResolvedValue(serie);
      expect(await service.update('1', updateSerieDto)).toEqual(serie);
    });
  });
  describe('deactivate', () => {
    it('should deactivate a serie by ID', async () => {
      const serie: Serie = { id: '1', nome: 'Serie 1', ativo: true };
      const deactivatedSerie = { ...serie, ativo: false };

      jest.spyOn(repository, 'update').mockResolvedValue({} as any);
      jest
        .spyOn(repository, 'findOneByOrFail')
        .mockResolvedValue(deactivatedSerie);
      expect(await service.deactivate('1')).toEqual(deactivatedSerie);
    });
  });
});
