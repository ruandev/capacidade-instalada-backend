import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsuarioService } from '../usuario/usuario.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt-updated';
import { UnauthorizedException } from '@nestjs/common';
import { Usuario } from '../usuario/entities/usuario.entity';
import { Role } from './role.enum';

describe('AuthService', () => {
  let service: AuthService;

  let usuarioService: UsuarioService;

  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsuarioService,
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usuarioService = module.get<UsuarioService>(UsuarioService);
    jwtService = module.get<JwtService>(JwtService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('validateUser', () => {
    it('should return access token if user is valid', async () => {
      const mockUser: Usuario = {
        id: '1',
        nome: 'Test User',
        cpf: '12345678900',
        password: await bcrypt.hash('password', 10),
        role: Role.ADMIN,
        ativo: true,
      };
      const mockJwtToken = 'mock_jwt_token';

      jest.spyOn(usuarioService, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compareSync').mockReturnValue(true);
      jest.spyOn(jwtService, 'sign').mockReturnValue(mockJwtToken);

      const result = await service.validateUser('12345678900', 'password');

      expect(result.user).toEqual({
        id: '1',
        nome: 'Test User',
        role: 'admin',
      });
      expect(result.access_token).toEqual(mockJwtToken);
    });
    it('should throw UnauthorizedException if user does not exist', async () => {
      jest.spyOn(usuarioService, 'findOne').mockResolvedValue(null);
      await expect(
        service.validateUser('12345678900', 'password'),
      ).rejects.toThrow(UnauthorizedException);
    });
    it('should throw UnauthorizedException if password is invalid', async () => {
      const mockUser: Usuario = {
        id: '1',
        nome: 'Test User',
        cpf: '12345678900',
        password: await bcrypt.hash('password', 10),
        role: Role.ADMIN,
        ativo: true,
      };

      jest.spyOn(usuarioService, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compareSync').mockReturnValue(false);
      await expect(
        service.validateUser('12345678900', 'invalid_password'),
      ).rejects.toThrow(UnauthorizedException);
    });
    it('should throw UnauthorizedException if any error occurs', async () => {
      jest
        .spyOn(usuarioService, 'findOne')
        .mockRejectedValue(Error('Some Error'));
      await expect(
        service.validateUser('12345678900', 'password'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
