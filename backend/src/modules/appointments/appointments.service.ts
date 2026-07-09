import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomBytes } from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { ServicesService } from '../services/services.service';
import { BusinessHoursService } from '../business-hours/business-hours.service';
import { HolidaysService } from '../holidays/holidays.service';
import { EmailService } from '../email/email.service';
import { SettingsService } from '../settings/settings.service';
import { CreateAppointmentDto, RescheduleAppointmentDto } from './dto';
import { addMinutesToTime, rangesOverlap, timeToMinutes } from './time.util';

@Injectable()
export class AppointmentsService {
  constructor(
    private prisma: PrismaService,
    private servicesService: ServicesService,
    private businessHoursService: BusinessHoursService,
    private holidaysService: HolidaysService,
    private emailService: EmailService,
    private settingsService: SettingsService,
  ) {}

  // DISPONIBILIDAD 

  /**
   * Calcula los horarios disponibles para un servicio en una fecha dada,
   * respetando horario laboral, descansos, festivos y citas ya existentes.
   */
  async getAvailability(serviceId: string, dateStr: string) {
    const service = await this.servicesService.findOne(serviceId);
    const date = this.parseDate(dateStr);

    const isHoliday = await this.holidaysService.isHoliday(date);
    if (isHoliday) return { available: false, reason: 'FESTIVO', slots: [] };

    const dayOfWeek = date.getDay();
    const hours = await this.businessHoursService.findByDay(dayOfWeek);
    if (!hours || !hours.isOpen) {
      return { available: false, reason: 'CERRADO', slots: [] };
    }

    const existing = await this.prisma.appointment.findMany({
      where: {
        date,
        status: { in: ['PENDING', 'CONFIRMED'] },
      },
    });

    const breaks = (hours.breaks as { start: string; end: string }[] | null) || [];
    const openMin = timeToMinutes(hours.openTime);
    const closeMin = timeToMinutes(hours.closeTime);
    const duration = service.duration;
    const stepMinutes = 15; // granularidad de los slots ofrecidos

    const slots: string[] = [];
    const now = new Date();
    const isToday = this.isSameDay(date, now);
    const nowMinutes = now.getHours() * 60 + now.getMinutes();

    for (let start = openMin; start + duration <= closeMin; start += stepMinutes) {
      const end = start + duration;

      // No ofrecer horarios ya pasados si es hoy
      if (isToday && start <= nowMinutes) continue;

      // Descansos configurados
      const overlapsBreak = breaks.some((b) =>
        rangesOverlap(start, end, timeToMinutes(b.start), timeToMinutes(b.end)),
      );
      if (overlapsBreak) continue;

      // Citas ya existentes
      const overlapsAppointment = existing.some((a) =>
        rangesOverlap(start, end, timeToMinutes(a.startTime), timeToMinutes(a.endTime)),
      );
      if (overlapsAppointment) continue;

      slots.push(addMinutesToTime('00:00', start));
    }

    return { available: slots.length > 0, reason: null, slots };
  }

  // CREACIÓN DE CITA (con todas las validaciones del negocio)

  async create(dto: CreateAppointmentDto) {
    const service = await this.servicesService.findOne(dto.serviceId);
    const date = this.parseDate(dto.date);
    const startTime = dto.startTime;
    const endTime = addMinutesToTime(startTime, service.duration);

    await this.validateBookingRules(date, startTime, endTime);

    // Reservaciones duplicadas: mismo correo, misma fecha/hora, no cancelada
    const duplicate = await this.prisma.appointment.findFirst({
      where: {
        customerEmail: dto.customerEmail,
        date,
        startTime,
        status: { in: ['PENDING', 'CONFIRMED'] },
      },
    });
    if (duplicate) {
      throw new ConflictException('Ya existe una reservación con estos datos para esta fecha y hora');
    }

    const managementToken = randomBytes(32).toString('hex');

    const appointment = await this.prisma.appointment.create({
      data: {
        customerName: dto.customerName,
        customerEmail: dto.customerEmail,
        customerPhone: dto.customerPhone,
        serviceId: dto.serviceId,
        date,
        startTime,
        endTime,
        notes: dto.notes,
        managementToken,
        status: 'PENDING',
      },
      include: { service: true },
    });

    await this.notify(appointment, 'CREATED');

    return appointment;
  }

  // GESTIÓN POR TOKEN (cliente sin cuenta)

  async findByToken(token: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { managementToken: token },
      include: { service: true },
    });
    if (!appointment) throw new NotFoundException('Reservación no encontrada');
    return appointment;
  }

  async cancelByToken(token: string) {
    const appointment = await this.findByToken(token);
    this.assertNotAlreadyClosed(appointment);

    const settings = await this.settingsService.get();
    const hoursUntil = this.hoursUntilAppointment(appointment.date, appointment.startTime);
    if (hoursUntil < settings.cancelWindowHours) {
      throw new BadRequestException(
        `No se puede cancelar con menos de ${settings.cancelWindowHours} horas de anticipación`,
      );
    }

    const updated = await this.prisma.appointment.update({
      where: { id: appointment.id },
      data: { status: 'CANCELLED', tokenExpiresAt: new Date() },
      include: { service: true },
    });

    await this.notify(updated, 'CANCELLED');
    return updated;
  }

  async rescheduleByToken(token: string, dto: RescheduleAppointmentDto) {
    const appointment = await this.findByToken(token);
    this.assertNotAlreadyClosed(appointment);

    const settings = await this.settingsService.get();
    const hoursUntil = this.hoursUntilAppointment(appointment.date, appointment.startTime);
    if (hoursUntil < settings.rescheduleWindowHours) {
      throw new BadRequestException(
        `No se puede reagendar con menos de ${settings.rescheduleWindowHours} horas de anticipación`,
      );
    }

    const service = await this.servicesService.findOne(appointment.serviceId);
    const newDate = this.parseDate(dto.date);
    const newStart = dto.startTime;
    const newEnd = addMinutesToTime(newStart, service.duration);

    await this.validateBookingRules(newDate, newStart, newEnd, appointment.id);

    const updated = await this.prisma.appointment.update({
      where: { id: appointment.id },
      data: { date: newDate, startTime: newStart, endTime: newEnd, status: 'PENDING' },
      include: { service: true },
    });

    await this.notify(updated, 'RESCHEDULED');
    return updated;
  }

  // ADMINISTRACIÓN

  async findAll(filters: { from?: string; to?: string; status?: string }) {
    return this.prisma.appointment.findMany({
      where: {
        date:
          filters.from || filters.to
            ? {
                gte: filters.from ? this.parseDate(filters.from) : undefined,
                lte: filters.to ? this.parseDate(filters.to) : undefined,
              }
            : undefined,
        status: (filters.status as any) || undefined,
      },
      include: { service: true },
      orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
    });
  }

  async findOne(id: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
      include: { service: true },
    });
    if (!appointment) throw new NotFoundException('Reservación no encontrada');
    return appointment;
  }

  async updateStatus(id: string, status: 'PENDING' | 'CONFIRMED' | 'FINISHED' | 'CANCELLED') {
    const appointment = await this.findOne(id);
    const updated = await this.prisma.appointment.update({
      where: { id: appointment.id },
      data: {
        status,
        tokenExpiresAt: status === 'CANCELLED' || status === 'FINISHED' ? new Date() : null,
      },
      include: { service: true },
    });

    if (status === 'CONFIRMED') await this.notify(updated, 'CONFIRMED');
    if (status === 'CANCELLED') await this.notify(updated, 'CANCELLED');

    return updated;
  }

  async getDashboardStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const [todayCount, monthAppointments, cancelledThisMonth] = await Promise.all([
      this.prisma.appointment.count({
        where: { date: { gte: today, lt: tomorrow }, status: { in: ['PENDING', 'CONFIRMED', 'FINISHED'] } },
      }),
      this.prisma.appointment.findMany({
        where: { date: { gte: startOfMonth }, status: 'FINISHED' },
        include: { service: true },
      }),
      this.prisma.appointment.count({
        where: { date: { gte: startOfMonth }, status: 'CANCELLED' },
      }),
    ]);

    const revenue = monthAppointments.reduce((sum, a) => sum + Number(a.service.price), 0);
    const uniqueCustomers = new Set(monthAppointments.map((a) => a.customerEmail)).size;

    return {
      appointmentsToday: todayCount,
      monthlyRevenue: revenue,
      newCustomersThisMonth: uniqueCustomers,
      cancelledThisMonth,
    };
  }

  // REGLAS DE VALIDACIÓN (privadas)

  private async validateBookingRules(
    date: Date,
    startTime: string,
    endTime: string,
    excludeAppointmentId?: string,
  ) {
    const now = new Date();
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);

    // 1. No fechas pasadas
    if (date < todayStart) {
      throw new BadRequestException('No se pueden reservar fechas pasadas');
    }

    // Si es hoy, la hora de inicio no puede haber pasado ya
    if (this.isSameDay(date, now)) {
      const nowMinutes = now.getHours() * 60 + now.getMinutes();
      if (timeToMinutes(startTime) <= nowMinutes) {
        throw new BadRequestException('No se puede reservar un horario que ya pasó');
      }
    }

    // 2. No domingos (regla fija adicional a la de horario laboral)
    if (date.getDay() === 0) {
      throw new BadRequestException('No se reciben reservaciones los domingos');
    }

    // 3. No días festivos
    const isHoliday = await this.holidaysService.isHoliday(date);
    if (isHoliday) {
      throw new BadRequestException('La fecha seleccionada es un día festivo');
    }

    // 4. Dentro de horario laboral
    const hours = await this.businessHoursService.findByDay(date.getDay());
    if (!hours || !hours.isOpen) {
      throw new BadRequestException('El negocio no labora ese día');
    }
    const openMin = timeToMinutes(hours.openTime);
    const closeMin = timeToMinutes(hours.closeTime);
    const startMin = timeToMinutes(startTime);
    const endMin = timeToMinutes(endTime);
    if (startMin < openMin || endMin > closeMin) {
      throw new BadRequestException('El horario seleccionado está fuera del horario laboral');
    }

    // 5. No durante descansos
    const breaks = (hours.breaks as { start: string; end: string }[] | null) || [];
    const overlapsBreak = breaks.some((b) =>
      rangesOverlap(startMin, endMin, timeToMinutes(b.start), timeToMinutes(b.end)),
    );
    if (overlapsBreak) {
      throw new BadRequestException('El horario seleccionado coincide con un descanso configurado');
    }

    // 6. No horarios ocupados (traslape con otras citas activas)
    const sameDay = await this.prisma.appointment.findMany({
      where: {
        date,
        status: { in: ['PENDING', 'CONFIRMED'] },
        id: excludeAppointmentId ? { not: excludeAppointmentId } : undefined,
      },
    });
    const overlapsAppointment = sameDay.some((a) =>
      rangesOverlap(startMin, endMin, timeToMinutes(a.startTime), timeToMinutes(a.endTime)),
    );
    if (overlapsAppointment) {
      throw new ConflictException('El horario seleccionado ya no está disponible');
    }
  }

  private assertNotAlreadyClosed(appointment: { status: string }) {
    if (appointment.status === 'CANCELLED' || appointment.status === 'FINISHED') {
      throw new BadRequestException('Esta reservación ya no se puede modificar');
    }
  }

  private hoursUntilAppointment(date: Date, startTime: string): number {
    const appointmentDateTime = new Date(date);
    const [h, m] = startTime.split(':').map(Number);
    appointmentDateTime.setHours(h, m, 0, 0);
    const diffMs = appointmentDateTime.getTime() - Date.now();
    return diffMs / (1000 * 60 * 60);
  }

  private parseDate(dateStr: string): Date {
    const date = new Date(dateStr);
    date.setHours(0, 0, 0, 0);
    return date;
  }

  private isSameDay(a: Date, b: Date): boolean {
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  }

  private async notify(appointment: any, type: 'CREATED' | 'CONFIRMED' | 'CANCELLED' | 'RESCHEDULED') {
    const settings = await this.settingsService.get();
    const managementUrl = `${process.env.FRONTEND_URL}/mi-cita/${appointment.managementToken}`;

    const data = {
      customerName: appointment.customerName,
      serviceName: appointment.service.name,
      date: appointment.date.toLocaleDateString('es-MX'),
      startTime: appointment.startTime,
      managementUrl,
      businessName: settings.businessName,
    };

    // Correo al cliente
    await this.emailService.sendAppointmentEmail({
      appointmentId: appointment.id,
      to: appointment.customerEmail,
      type,
      data,
    });

    // Correo a la barbería
    if (settings.email) {
      await this.emailService.sendAppointmentEmail({
        appointmentId: appointment.id,
        to: settings.email,
        type,
        data,
      });
    }
  }
}
