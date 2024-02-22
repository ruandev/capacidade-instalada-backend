import { Test, TestingModule } from '@nestjs/testing';
import { UsuarioService } from './usuario.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import * as bcrypt from 'bcrypt';
import { Role } from '../auth/role.enum';

describe('UsuarioService', () => {
  let service: UsuarioService;
  let repository: Repository<Usuario>;

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsuarioService,
        {
          provide: getRepositoryToken(Usuario),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UsuarioService>(UsuarioService);
    repository = module.get<Repository<Usuario>>(getRepositoryToken(Usuario));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new usuario', async () => {
      const mockHash = jest
        .spyOn(bcrypt, 'hash')
        .mockResolvedValue('hashedPassword');

      const createDto: CreateUsuarioDto = {
        nome: 'Teste',
        cpf: '12345678901',
        role: Role.SECRETARIA,
        password: '123456',
      };

      const usuario = new Usuario();

      usuario.nome = createDto.nome;
      usuario.cpf = createDto.cpf;
      usuario.role = createDto.role;

      jest.spyOn(repository, 'save').mockResolvedValue(usuario);
      const result = await service.create(createDto);
      expect(result).toEqual(usuario);
      expect(repository.save).toHaveBeenCalled();
      expect(mockHash).toHaveBeenCalledWith(createDto.password, 10);
    });
  });

  describe('findAll', () => {
    it('should return an array of usuarios', async () => {
      const usuarios = [new Usuario(), new Usuario()];
      jest.spyOn(repository, 'find').mockResolvedValue(usuarios);

      expect(await service.findAll()).toEqual(usuarios);
    });
  });

  describe('findOne', () => {
    it('should return a usuario by id', async () => {
      const usuario = new Usuario();
      jest.spyOn(repository, 'findOneByOrFail').mockResolvedValue(usuario);

      expect(await service.findOne('1')).toEqual(usuario);
    });
  });

  describe('update', () => {
    it('should update a usuario without password', async () => {
      const updateDto: UpdateUsuarioDto = {
        nome: 'Novo Nome',
        cpf: '98765432109',
      };
      const usuario = new Usuario();
      usuario.nome = updateDto.nome;
      usuario.cpf = updateDto.cpf;
      jest.spyOn(repository, 'update').mockResolvedValue(undefined);
      jest.spyOn(repository, 'findOneByOrFail').mockResolvedValue(usuario);

      const updatedUsuario = await service.update('1', updateDto);

      expect(updatedUsuario).toEqual(usuario);
      expect(updatedUsuario.nome).toEqual(updateDto.nome);
      expect(updatedUsuario.cpf).toEqual(updateDto.cpf);
      expect(jest.spyOn(bcrypt, 'hash')).not.toHaveBeenCalled();
    });

    it('should update a usuario with password', async () => {
      const updateDto: UpdateUsuarioDto = {
        nome: 'Novo Nome',
        cpf: '98765432109',
        password: '654321',
      };
      const usuario = new Usuario();
      usuario.nome = updateDto.nome;
      usuario.cpf = updateDto.cpf;
      usuario.password = updateDto.password;
      jest.spyOn(repository, 'update').mockResolvedValue(undefined);
      jest.spyOn(repository, 'findOneByOrFail').mockResolvedValue(usuario);

      const updatedUsuario = await service.update('1', updateDto);

      expect(updatedUsuario).toEqual(usuario);
      expect(updatedUsuario.nome).toEqual(updateDto.nome);
      expect(updatedUsuario.cpf).toEqual(updateDto.cpf);
      expect(jest.spyOn(bcrypt, 'hash')).toHaveBeenCalledWith(
        updateDto.password,
        10,
      );
    });
  });

  describe('findByCPF', () => {
    it('should return a usuario by CPF', async () => {
      const usuario = new Usuario();
      jest.spyOn(repository, 'findOneByOrFail').mockResolvedValue(usuario);

      expect(await service.findByCPF('12345678901')).toEqual(usuario);
    });
  });

  describe('deactivate', () => {
    it('should deactivate a usuario', async () => {
      const usuario = new Usuario();
      usuario.id = '1';
      usuario.ativo = false;
      jest.spyOn(repository, 'update').mockResolvedValue(undefined);
      jest.spyOn(repository, 'findOneByOrFail').mockResolvedValue(usuario);

      const deactivatedUsuario = await service.deactivate(usuario.id);

      expect(deactivatedUsuario.ativo).toBe(false);
    });
  });
});
