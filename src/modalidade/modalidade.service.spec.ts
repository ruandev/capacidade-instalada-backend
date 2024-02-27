import { Test, TestingModule } from '@nestjs/testing';
import { ModalidadeService } from './modalidade.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Modalidade } from './entities/modalidade.entity';
import { CreateModalidadeDto } from './dto/create-modalidade.dto';
import { UpdateModalidadeDto } from './dto/update-modalidade.dto';

describe('ModalidadeService', () => {
  let service: ModalidadeService;

  let repository: Repository<Modalidade>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ModalidadeService,
        {
          provide: getRepositoryToken(Modalidade),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<ModalidadeService>(ModalidadeService);
    repository = module.get<Repository<Modalidade>>(
      getRepositoryToken(Modalidade),
    );
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('create', () => {
    it('should create a new modalidade', async () => {
      const createModalidadeDto: CreateModalidadeDto = {
        nome: 'Modalidade 1',
      };
      const modalidade = new Modalidade();

      modalidade.nome = createModalidadeDto.nome;
      jest.spyOn(repository, 'save').mockResolvedValue(modalidade);
      expect(await service.create(createModalidadeDto)).toEqual(modalidade);
    });
  });
  describe('findAll', () => {
    it('should return all modalidades', async () => {
      const modalidades: Modalidade[] = [
        { id: '1', nome: 'Modalidade 1', ativo: true, escolas: [] },
      ];

      jest.spyOn(repository, 'find').mockResolvedValue(modalidades);
      expect(await service.findAll()).toEqual(modalidades);
    });
  });
  describe('findOne', () => {
    it('should return a modalidade by ID', async () => {
      const modalidade: Modalidade = {
        id: '1',
        nome: 'Modalidade 1',
        ativo: true,
        escolas: [],
      };

      jest.spyOn(repository, 'findOneByOrFail').mockResolvedValue(modalidade);
      expect(await service.findOne('1')).toEqual(modalidade);
    });
  });
  describe('update', () => {
    it('should update a modalidade by ID', async () => {
      const updateModalidadeDto: UpdateModalidadeDto = {
        nome: 'Updated Modalidade',
      };
      const modalidade: Modalidade = {
        id: '1',
        nome: 'Updated Modalidade',
        ativo: true,
        escolas: [],
      };

      jest.spyOn(repository, 'update').mockResolvedValue({} as any);
      jest.spyOn(repository, 'findOneByOrFail').mockResolvedValue(modalidade);
      expect(await service.update('1', updateModalidadeDto)).toEqual(
        modalidade,
      );
    });
  });
  describe('deactivate', () => {
    it('should deactivate a modalidade by ID', async () => {
      const modalidade: Modalidade = {
        id: '1',
        nome: 'Modalidade 1',
        ativo: true,
        escolas: [],
      };
      const deactivatedModalidade = { ...modalidade, ativo: false };

      jest.spyOn(repository, 'update').mockResolvedValue({} as any);
      jest
        .spyOn(repository, 'findOneByOrFail')
        .mockResolvedValue(deactivatedModalidade);
      expect(await service.deactivate('1')).toEqual(deactivatedModalidade);
    });
  });
});
