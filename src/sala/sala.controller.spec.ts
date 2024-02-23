/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { SalaController } from './sala.controller';
import { SalaService } from './sala.service';
import { CreateSalaDto } from './dto/create-sala.dto';
import {
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Turno } from './entities/turno.enum';
import { Sala } from './entities/sala.entity';
import { Serie } from '../serie/entities/serie.entity';
import { Escola } from '../escola/entities/escola.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthService } from '../auth/auth.service';
import { RolesGuard } from '../auth/roles.guard';
import { Role } from '../auth/role.enum';
import { HistoricoAlteracaoService } from '../historico-alteracao/historico-alteracao.service';

const mockCreateSalaDto: CreateSalaDto = {
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
const mockSala: Sala = {
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

@Injectable()
class MockAuthService {
  validateUser(user: any) {
    return { id: '1', username: 'testuser', roles: [Role.SECRETARIA] };
  }
}

@Injectable()
class MockRolesGuard {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    request.user = { id: '1', username: 'testuser', roles: [Role.ADMIN] };

    return true;
  }
}

describe('SalaController', () => {
  let controller: SalaController;

  let salaService: SalaService;

  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      controllers: [SalaController],
      providers: [
        SalaService,
        {
          provide: AuthService,
          useClass: MockAuthService,
        },
        {
          provide: RolesGuard,
          useClass: MockRolesGuard,
        },
        {
          provide: getRepositoryToken(Sala),
          useClass: Repository,
        },
        {
          provide: HistoricoAlteracaoService,
          useValue: {},
        },
      ],
    }).compile();
    controller = module.get<SalaController>(SalaController);
    salaService = module.get<SalaService>(SalaService);
  });
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('findAll', () => {
    it('should return all salas', async () => {
      const mockResult = [mockSala];

      jest.spyOn(salaService, 'findAll').mockResolvedValue(mockResult);
      expect(await controller.findAll()).toBe(mockResult);
    });
  });
  describe('findOne', () => {
    it('should return one sala', async () => {
      const mockSalaId = '1';

      jest.spyOn(salaService, 'findOne').mockResolvedValue(mockSala);
      expect(await controller.findOne(mockSalaId)).toBe(mockSala);
    });
    it('should throw NotFoundException if sala is not found', async () => {
      const mockSalaId = '1';

      jest.spyOn(salaService, 'findOne').mockRejectedValue(new Error());
      await expect(controller.findOne(mockSalaId)).rejects.toThrow();
    });
  });
  describe('create', () => {
    it('should create a new sala', async () => {
      jest.spyOn(salaService, 'create').mockResolvedValue(mockSala);
      expect(await controller.create(mockCreateSalaDto)).toBe(mockSala);
    });
    it('should throw UnauthorizedException if user does not have required roles', async () => {
      const mockRolesGuard = module.get<MockRolesGuard>(RolesGuard);

      jest.spyOn(mockRolesGuard, 'canActivate').mockReturnValue(false);
      await expect(controller.create(mockCreateSalaDto)).rejects.toThrow();
    });
  });
  describe('deactivate', () => {
    it('should deactivate a sala', async () => {
      const mockSalaId = '1';
      const mockResult = { ...mockSala, ativo: false };

      jest.spyOn(salaService, 'deactivate').mockResolvedValue(mockResult);

      const result = await controller.deactivate(mockSalaId);

      expect(result).toBe(mockResult);
    });
    it('should throw UnauthorizedException if user does not have required roles', async () => {
      const mockSalaId = '1';
      const mockRolesGuard = module.get<MockRolesGuard>(RolesGuard);

      jest.spyOn(mockRolesGuard, 'canActivate').mockReturnValue(false);
      await expect(controller.deactivate(mockSalaId)).rejects.toThrow();
    });
  });
});
