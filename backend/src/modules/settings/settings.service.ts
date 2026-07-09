import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateSettingsDto } from './dto';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async get() {
    let settings = await this.prisma.settings.findFirst();
    if (!settings) {
      settings = await this.prisma.settings.create({ data: {} });
    }
    return settings;
  }

  async update(dto: UpdateSettingsDto) {
    const current = await this.get();

    // id y updatedAt los genera/controla la base de datos; se descartan
    // aquí aunque el frontend los reenvíe tal cual desde el GET, para
    // que Prisma nunca intente sobreescribirlos con un valor viejo.
    const { id, updatedAt, ...data } = dto;

    return this.prisma.settings.update({
      where: { id: current.id },
      data,
    });
  }
}