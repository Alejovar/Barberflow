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
    return this.prisma.settings.update({ where: { id: current.id }, data: dto });
  }
}
