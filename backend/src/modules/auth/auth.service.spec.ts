import { Test } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { AuthService } from './auth.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: { user: { findUnique: jest.Mock } };

  beforeEach(async () => {
    prisma = { user: { findUnique: jest.fn() } };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prisma },
        { provide: JwtService, useValue: { signAsync: jest.fn().mockResolvedValue('fake-token') } },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('rechaza login con correo inexistente', async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    await expect(service.login({ email: 'x@x.com', password: '123456' })).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('rechaza login con contraseña incorrecta', async () => {
    const hash = await bcrypt.hash('correcta123', 10);
    prisma.user.findUnique.mockResolvedValue({
      id: '1',
      email: 'admin@barberflow.com',
      password: hash,
      role: 'ADMIN',
    });
    await expect(
      service.login({ email: 'admin@barberflow.com', password: 'incorrecta' }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('genera un token con credenciales válidas', async () => {
    const hash = await bcrypt.hash('correcta123', 10);
    prisma.user.findUnique.mockResolvedValue({
      id: '1',
      name: 'Admin',
      email: 'admin@barberflow.com',
      password: hash,
      role: 'ADMIN',
    });
    const result = await service.login({ email: 'admin@barberflow.com', password: 'correcta123' });
    expect(result.accessToken).toBe('fake-token');
    expect(result.user.email).toBe('admin@barberflow.com');
  });
});
