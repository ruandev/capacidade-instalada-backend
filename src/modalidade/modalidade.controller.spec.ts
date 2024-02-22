/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { ModalidadeController } from './modalidade.controller';
import { ModalidadeService } from './modalidade.service';
import { CreateModalidadeDto } from './dto/create-modalidade.dto';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Role } from '../auth/role.enum';
import { AuthService } from '../auth/auth.service';
import { RolesGuard } from '../auth/roles.guard';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Modalidade } from './entities/modalidade.entity';
import { Repository } from 'typeorm';
import { UpdateModalidadeDto } from './dto/update-modalidade.dto';

@Injectable()
class MockAuthService {
  validateUser(user: any) {
    return { id: '1', username: 'testuser', roles: [Role.ADMIN] };
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

describe('ModalidadeController', () => {
  let controller: ModalidadeController;

  let service: ModalidadeService;

  let testingModule: TestingModule;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      controllers: [ModalidadeController],
      providers: [
        ModalidadeService,
        {
          provide: AuthService,
          useClass: MockAuthService,
        },
        {
          provide: RolesGuard,
          useClass: MockRolesGuard,
        },
        {
          provide: getRepositoryToken(Modalidade),
          useClass: Repository,
        },
      ],
    }).compile();
    controller = testingModule.get<ModalidadeController>(ModalidadeController);
    service = testingModule.get<ModalidadeService>(ModalidadeService);
  });
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('create', () => {
    it('should create a new modalidade', async () => {
      const dto: CreateModalidadeDto = { nome: 'Modalidade 1' };
      const result = { id: '1', ...dto, ativo: true };

      jest.spyOn(service, 'create').mockResolvedValue(result);
      expect(await controller.create(dto)).toBe(result);
    });
    it('should throw an error if user does not have Role Admin', async () => {
      const dto: CreateModalidadeDto = { nome: 'Modalidade 1' };
      const mockRolesGuard = testingModule.get<MockRolesGuard>(RolesGuard);

      jest.spyOn(mockRolesGuard, 'canActivate').mockReturnValue(false);
      await expect(controller.create(dto)).rejects.toThrow();
    });
  });
  describe('findAll', () => {
    it('should return an array of modalidades', async () => {
      const result = [{ id: '1', nome: 'Modalidade 1', ativo: true }];

      jest.spyOn(service, 'findAll').mockResolvedValue(result);
      expect(await controller.findAll()).toBe(result);
    });
  });
  describe('findOne', () => {
    it('should return a modalidade by ID', async () => {
      const result = { id: '1', nome: 'Modalidade 1', ativo: true };

      jest.spyOn(service, 'findOne').mockResolvedValue(result);
      expect(await controller.findOne('1')).toBe(result);
    });
  });
  describe('update', () => {
    it('should update a modalidade by ID', async () => {
      const dto: UpdateModalidadeDto = { nome: 'Updated Modalidade' };
      const result = { id: '1', nome: 'Updated Modalidade', ativo: true };

      jest.spyOn(service, 'update').mockResolvedValue(result);
      expect(await controller.update('1', dto)).toBe(result);
    });
    it('should throw an error if user does not have Role Admin', async () => {
      const mockRolesGuard = testingModule.get<MockRolesGuard>(RolesGuard);

      jest.spyOn(mockRolesGuard, 'canActivate').mockReturnValue(false);
      await expect(controller.update('1', { nome: '' })).rejects.toThrow();
    });
  });
  describe('deactivate', () => {
    it('should deactivate a modalidade by ID', async () => {
      const result = { id: '1', nome: 'Modalidade 1', ativo: false };

      jest.spyOn(service, 'deactivate').mockResolvedValue(result);
      expect(await controller.deactivate('1')).toBe(result);
    });
    it('should throw an error if user does not have Role Admin', async () => {
      const mockRolesGuard = testingModule.get<MockRolesGuard>(RolesGuard);

      jest.spyOn(mockRolesGuard, 'canActivate').mockReturnValue(false);
      await expect(controller.deactivate('1')).rejects.toThrow();
    });
  });
});
