import { Test, TestingModule } from '@nestjs/testing';
import { UsuarioController } from './usuario.controller';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Role } from '../auth/role.enum';
import { AuthGuard } from '@nestjs/passport';

class MockUsuarioService {
  create(createUsuarioDto: CreateUsuarioDto) {
    return { id: '1', ...createUsuarioDto };
  }

  findAll() {
    return [{ id: '1', nome: 'Teste', cpf: '12345678901', role: Role.ADMIN }];
  }

  findOne(id: string) {
    return { id, nome: 'Teste', cpf: '12345678901', role: Role.ADMIN };
  }

  update(id: string, updateUsuarioDto: UpdateUsuarioDto) {
    return { id, ...updateUsuarioDto };
  }

  deactivate(id: string) {
    return { id, ativo: false };
  }
}

describe('UsuarioController', () => {
  let controller: UsuarioController;

  let app: INestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsuarioController],
      providers: [
        {
          provide: UsuarioService,
          useClass: MockUsuarioService,
        },
      ],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<UsuarioController>(UsuarioController);
    app = module.createNestApplication();
    await app.init();
  });
  afterEach(async () => {
    await app.close();
  });
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('should create a new usuario', async () => {
    const createUsuarioDto: CreateUsuarioDto = {
      nome: 'Teste',
      cpf: '12345678901',
      role: Role.ADMIN,
      password: '123456',
    };
    const result = await controller.create(createUsuarioDto);

    expect(result).toEqual({ id: '1', ...createUsuarioDto });
  });
  it('should find all usuarios', async () => {
    const result = await controller.findAll();

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      id: '1',
      nome: 'Teste',
      cpf: '12345678901',
      role: Role.ADMIN,
    });
  });
  it('should find one usuario', async () => {
    const result = await controller.findOne('1');

    expect(result).toEqual({
      id: '1',
      nome: 'Teste',
      cpf: '12345678901',
      role: Role.ADMIN,
    });
  });
  it('should update a usuario', async () => {
    const updateUsuarioDto: UpdateUsuarioDto = {
      nome: 'Novo Nome',
      cpf: '98765432109',
    };
    const result = await controller.update('1', updateUsuarioDto);

    expect(result).toEqual({ id: '1', ...updateUsuarioDto });
  });
  it('should deactivate a usuario', async () => {
    const result = await controller.deactivate('1');

    expect(result).toEqual({ id: '1', ativo: false });
  });
});
