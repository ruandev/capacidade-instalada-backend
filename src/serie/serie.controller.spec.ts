/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { SerieController } from './serie.controller';
import { SerieService } from './serie.service';
import { CreateSerieDto } from './dto/create-serie.dto';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Role } from '../auth/role.enum';
import { AuthService } from '../auth/auth.service';
import { RolesGuard } from '../auth/roles.guard';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Serie } from './entities/serie.entity';
import { Repository } from 'typeorm';
import { UpdateSerieDto } from './dto/update-serie.dto';

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

describe('SerieController', () => {
  let controller: SerieController;

  let service: SerieService;

  let testingModule: TestingModule;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      controllers: [SerieController],
      providers: [
        SerieService,
        {
          provide: AuthService,
          useClass: MockAuthService,
        },
        {
          provide: RolesGuard,
          useClass: MockRolesGuard,
        },
        {
          provide: getRepositoryToken(Serie),
          useClass: Repository,
        },
      ],
    }).compile();
    controller = testingModule.get<SerieController>(SerieController);
    service = testingModule.get<SerieService>(SerieService);
  });
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('create', () => {
    it('should create a new serie', async () => {
      const dto: CreateSerieDto = { nome: 'Serie 1' };
      const result = { id: '1', ...dto, ativo: true };

      jest.spyOn(service, 'create').mockResolvedValue(result);
      expect(await controller.create(dto)).toBe(result);
    });
    it('should throw an error if user does not have Role Admin', async () => {
      const dto: CreateSerieDto = { nome: 'Serie 1' };
      const mockRolesGuard = testingModule.get<MockRolesGuard>(RolesGuard);

      jest.spyOn(mockRolesGuard, 'canActivate').mockReturnValue(false);
      await expect(controller.create(dto)).rejects.toThrow();
    });
  });
  describe('findAll', () => {
    it('should return an array of series', async () => {
      const result = [{ id: '1', nome: 'Serie 1', ativo: true }];

      jest.spyOn(service, 'findAll').mockResolvedValue(result);
      expect(await controller.findAll()).toBe(result);
    });
  });
  describe('findOne', () => {
    it('should return a serie by ID', async () => {
      const result = { id: '1', nome: 'Serie 1', ativo: true };

      jest.spyOn(service, 'findOne').mockResolvedValue(result);
      expect(await controller.findOne('1')).toBe(result);
    });
  });
  describe('update', () => {
    it('should update a serie by ID', async () => {
      const dto: UpdateSerieDto = { nome: 'Updated Serie' };
      const result = { id: '1', nome: 'Updated Serie', ativo: true };

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
    it('should deactivate a serie by ID', async () => {
      const result = { id: '1', nome: 'Serie 1', ativo: false };

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
