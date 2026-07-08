import { BadRequestException, ConflictException } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';

/**
 * Pruebas de las reglas de negocio más críticas del sistema de reservaciones.
 * Se mockean todas las dependencias para aislar la lógica de validación.
 */
describe('AppointmentsService - reglas de negocio', () => {
  let service: AppointmentsService;
  let prisma: any;
  let servicesService: any;
  let businessHoursService: any;
  let holidaysService: any;
  let emailService: any;
  let settingsService: any;

  const activeService = { id: 'svc-1', name: 'Corte Clásico', duration: 30, price: 150 };

  // Lunes a sábado abiertos 09:00-19:00 con descanso 14:00-15:00
  const openHours = {
    dayOfWeek: 1,
    isOpen: true,
    openTime: '09:00',
    closeTime: '19:00',
    breaks: [{ start: '14:00', end: '15:00' }],
  };

  beforeEach(() => {
    prisma = {
      appointment: {
        findFirst: jest.fn().mockResolvedValue(null),
        findMany: jest.fn().mockResolvedValue([]),
        create: jest.fn().mockImplementation(({ data }) =>
          Promise.resolve({ id: 'appt-1', ...data, service: activeService }),
        ),
      },
    };
    servicesService = { findOne: jest.fn().mockResolvedValue(activeService) };
    businessHoursService = { findByDay: jest.fn().mockResolvedValue(openHours) };
    holidaysService = { isHoliday: jest.fn().mockResolvedValue(false) };
    emailService = { sendAppointmentEmail: jest.fn().mockResolvedValue(undefined) };
    settingsService = {
      get: jest.fn().mockResolvedValue({
        businessName: 'BarberFlow',
        email: 'barberia@example.com',
        cancelWindowHours: 24,
        rescheduleWindowHours: 2,
      }),
    };

    service = new AppointmentsService(
      prisma,
      servicesService,
      businessHoursService,
      holidaysService,
      emailService,
      settingsService,
    );
  });

  function nextMonday(): Date {
    const date = new Date();
    date.setDate(date.getDate() + ((1 + 7 - date.getDay()) % 7 || 7));
    date.setHours(0, 0, 0, 0);
    return date;
  }

  const baseDto = () => ({
    customerName: 'Juan Pérez',
    customerEmail: 'juan@example.com',
    customerPhone: '8441234567',
    serviceId: 'svc-1',
    date: nextMonday().toISOString().split('T')[0],
    startTime: '10:00',
  });

  it('rechaza fechas pasadas', async () => {
    const dto = { ...baseDto(), date: '2020-01-01' };
    await expect(service.create(dto as any)).rejects.toThrow(BadRequestException);
  });

  it('rechaza reservaciones en domingo', async () => {
    const sunday = new Date();
    sunday.setDate(sunday.getDate() + ((7 - sunday.getDay()) % 7 || 7));
    const dto = { ...baseDto(), date: sunday.toISOString().split('T')[0] };
    await expect(service.create(dto as any)).rejects.toThrow(BadRequestException);
  });

  it('rechaza reservaciones en días festivos', async () => {
    holidaysService.isHoliday.mockResolvedValue(true);
    await expect(service.create(baseDto() as any)).rejects.toThrow(BadRequestException);
  });

  it('rechaza horarios fuera del horario laboral', async () => {
    const dto = { ...baseDto(), startTime: '20:00' };
    await expect(service.create(dto as any)).rejects.toThrow(BadRequestException);
  });

  it('rechaza horarios que coinciden con un descanso', async () => {
    const dto = { ...baseDto(), startTime: '14:15' };
    await expect(service.create(dto as any)).rejects.toThrow(BadRequestException);
  });

  it('rechaza horarios ya ocupados por otra cita', async () => {
    prisma.appointment.findMany.mockResolvedValue([
      { startTime: '10:00', endTime: '10:30', status: 'CONFIRMED' },
    ]);
    await expect(service.create(baseDto() as any)).rejects.toThrow(ConflictException);
  });

  it('rechaza reservaciones duplicadas del mismo cliente', async () => {
    prisma.appointment.findFirst.mockResolvedValue({ id: 'existing' });
    await expect(service.create(baseDto() as any)).rejects.toThrow(ConflictException);
  });

  it('crea la cita correctamente cuando todo es válido', async () => {
    const result = await service.create(baseDto() as any);
    expect(result.id).toBe('appt-1');
    expect(result.endTime).toBe('10:30');
    expect(emailService.sendAppointmentEmail).toHaveBeenCalled();
  });

  it('rechaza cancelaciones con menos de 24 horas de anticipación', async () => {
    const soon = new Date(Date.now() + 60 * 60 * 1000); // en 1 hora
    const findByTokenSpy = jest.spyOn(service, 'findByToken').mockResolvedValue({
      id: 'appt-1',
      status: 'PENDING',
      date: soon,
      startTime: `${soon.getHours()}:${String(soon.getMinutes()).padStart(2, '0')}`,
    } as any);

    await expect(service.cancelByToken('fake-token')).rejects.toThrow(BadRequestException);
    findByTokenSpy.mockRestore();
  });
});
