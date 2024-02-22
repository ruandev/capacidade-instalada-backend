/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { NucleoController } from './nucleo.controller';
import { NucleoService } from './nucleo.service';
import { CreateNucleoDto } from './dto/create-nucleo.dto';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Role } from '../auth/role.enum';
import { AuthService } from '../auth/auth.service';
import { RolesGuard } from '../auth/roles.guard';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Nucleo } from './entities/nucleo.entity';
import { Repository } from 'typeorm';
import { UpdateNucleoDto } from './dto/update-nucleo.dto';

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

describe('NucleoController', () => {
  let controller: NucleoController;

  let service: NucleoService;

  let testingModule: TestingModule;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      controllers: [NucleoController],
      providers: [
        NucleoService,
        {
          provide: AuthService,
          useClass: MockAuthService,
        },
        {
          provide: RolesGuard,
          useClass: MockRolesGuard,
        },
        {
          provide: getRepositoryToken(Nucleo),
          useClass: Repository,
        },
      ],
    }).compile();
    controller = testingModule.get<NucleoController>(NucleoController);
    service = testingModule.get<NucleoService>(NucleoService);
  });
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('create', () => {
    it('should create a new nucleo', async () => {
      const dto: CreateNucleoDto = { nome: 'Nucleo 1' };
      const result = { id: '1', ...dto, ativo: true, escolas: [] };

      jest.spyOn(service, 'create').mockResolvedValue(result);
      expect(await controller.create(dto)).toBe(result);
    });
    it('should throw an error if user does not have Role Admin', async () => {
      const dto: CreateNucleoDto = { nome: 'Nucleo 1' };
      const mockRolesGuard = testingModule.get<MockRolesGuard>(RolesGuard);

      jest.spyOn(mockRolesGuard, 'canActivate').mockReturnValue(false);
      await expect(controller.create(dto)).rejects.toThrow();
    });
  });
  describe('findAll', () => {
    it('should return an array of nucleos', async () => {
      const result = [{ id: '1', nome: 'Nucleo 1', ativo: true, escolas: [] }];

      jest.spyOn(service, 'findAll').mockResolvedValue(result);
      expect(await controller.findAll()).toBe(result);
    });
  });
  describe('findOne', () => {
    it('should return a nucleo by ID', async () => {
      const result = { id: '1', nome: 'Nucleo 1', ativo: true, escolas: [] };

      jest.spyOn(service, 'findOne').mockResolvedValue(result);
      expect(await controller.findOne('1')).toBe(result);
    });
  });
  describe('update', () => {
    it('should update a nucleo by ID', async () => {
      const dto: UpdateNucleoDto = { nome: 'Updated Nucleo' };
      const result = {
        id: '1',
        nome: 'Updated Nucleo',
        ativo: true,
        escolas: [],
      };

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
    it('should deactivate a nucleo by ID', async () => {
      const result = { id: '1', nome: 'Nucleo 1', ativo: false, escolas: [] };

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
