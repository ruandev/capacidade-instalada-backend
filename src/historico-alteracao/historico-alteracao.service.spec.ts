import { Test, TestingModule } from '@nestjs/testing';
import { HistoricoAlteracaoService } from './historico-alteracao.service';
import { CreateHistoricoAlteracaoDto } from './dto/create-historico-alteracao.dto';
import { HistoricoAlteracao } from './entities/historico-alteracao.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Usuario } from '../usuario/entities/usuario.entity';
import { Sala } from '../sala/entities/sala.entity';

const mockHistoricoAlteracao: HistoricoAlteracao = {
  id: '1',
  campo: 'Campo',
  valorAntigo: 'Valor Antigo',
  valorNovo: 'Valor Novo',
  usuario: Usuario.comId('1'),
  sala: Sala.comId('1'),
  createdAt: new Date(),
};

describe('HistoricoAlteracaoService', () => {
  let service: HistoricoAlteracaoService;

  let repository: Repository<HistoricoAlteracao>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HistoricoAlteracaoService,
        {
          provide: getRepositoryToken(HistoricoAlteracao),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<HistoricoAlteracaoService>(HistoricoAlteracaoService);
    repository = module.get<Repository<HistoricoAlteracao>>(
      getRepositoryToken(HistoricoAlteracao),
    );
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('create', () => {
    it('should create a new historicoAlteracao', async () => {
      const createDto: CreateHistoricoAlteracaoDto = {
        usuario_id: '1',
        sala_id: '1',
        campo: 'Campo',
        valorAntigo: 'Valor Antigo',
        valorNovo: 'Valor Novo',
      };

      jest.spyOn(repository, 'save').mockResolvedValue(mockHistoricoAlteracao);

      const result = await service.create(createDto);

      expect(result).toBe(mockHistoricoAlteracao);
      expect(repository.save).toHaveBeenCalledWith(
        expect.any(HistoricoAlteracao),
      );
    });
  });
  describe('findAll', () => {
    it('should return all historicoAlteracao', async () => {
      const historicoAlteracoes: HistoricoAlteracao[] = [
        mockHistoricoAlteracao,
      ];

      jest.spyOn(repository, 'find').mockResolvedValue(historicoAlteracoes);

      const result = await service.findAll();

      expect(result).toBe(historicoAlteracoes);
      expect(repository.find).toHaveBeenCalled();
    });
  });
  describe('findBySala', () => {
    it('should return historicoAlteracao by sala id', async () => {
      const salaId = '1';
      const historicoAlteracoes: HistoricoAlteracao[] = [
        mockHistoricoAlteracao,
      ];

      jest.spyOn(repository, 'findBy').mockResolvedValue(historicoAlteracoes);

      const result = await service.findBySala(salaId);

      expect(result).toBe(historicoAlteracoes);
      expect(repository.findBy).toHaveBeenCalledWith({ sala: { id: salaId } });
    });
  });
  describe('findByUsuario', () => {
    it('should return historicoAlteracao by usuario id', async () => {
      const usuarioId = '1';
      const historicoAlteracoes: HistoricoAlteracao[] = [
        mockHistoricoAlteracao,
      ];

      jest.spyOn(repository, 'findBy').mockResolvedValue(historicoAlteracoes);

      const result = await service.findByUsuario(usuarioId);

      expect(result).toBe(historicoAlteracoes);
      expect(repository.findBy).toHaveBeenCalledWith({
        usuario: { id: usuarioId },
      });
    });
  });
});
