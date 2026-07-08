import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateHolidayDto } from './dto';

@Injectable()
export class HolidaysService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.holiday.findMany({ orderBy: { date: 'asc' } });
  }

  create(dto: CreateHolidayDto) {
    return this.prisma.holiday.create({ data: { date: new Date(dto.date), label: dto.label } });
  }

  async remove(id: string) {
    const holiday = await this.prisma.holiday.findUnique({ where: { id } });
    if (!holiday) throw new NotFoundException('Día festivo no encontrado');
    return this.prisma.holiday.delete({ where: { id } });
  }

  async isHoliday(date: Date): Promise<boolean> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const holiday = await this.prisma.holiday.findFirst({ where: { date: startOfDay } });
    return !!holiday;
  }
}
