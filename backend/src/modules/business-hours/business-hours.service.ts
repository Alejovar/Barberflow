import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateBusinessHoursDto } from './dto';

@Injectable()
export class BusinessHoursService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.businessHours.findMany({ orderBy: { dayOfWeek: 'asc' } });
  }

  findByDay(dayOfWeek: number) {
    return this.prisma.businessHours.findUnique({ where: { dayOfWeek } });
  }

  upsert(dto: UpdateBusinessHoursDto) {
    return this.prisma.businessHours.upsert({
      where: { dayOfWeek: dto.dayOfWeek },
      update: { ...dto, breaks: dto.breaks as any },
      create: { ...dto, breaks: dto.breaks as any },
    });
  }
}
