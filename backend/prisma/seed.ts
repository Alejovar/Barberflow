import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Admin
  const passwordHash = await bcrypt.hash('Admin123!', 10);
  await prisma.user.upsert({
    where: { email: 'admin@barberflow.com' },
    update: {},
    create: {
      name: 'Administrador',
      email: 'admin@barberflow.com',
      password: passwordHash,
      role: 'ADMIN',
    },
  });

  // Servicios
  const services = [
    { name: 'Corte Clásico', description: 'Corte de cabello tradicional con tijera y máquina.', duration: 30, price: 150 },
    { name: 'Corte + Barba', description: 'Corte completo más arreglo de barba con navaja.', duration: 45, price: 220 },
    { name: 'Afeitado Premium', description: 'Afeitado clásico con toalla caliente y productos premium.', duration: 30, price: 180 },
    { name: 'Diseño de Barba', description: 'Perfilado y diseño de barba con línea definida.', duration: 20, price: 120 },
    { name: 'Corte Infantil', description: 'Corte de cabello para niños hasta 12 años.', duration: 25, price: 130 },
  ];

  for (const s of services) {
    const existing = await prisma.service.findFirst({ where: { name: s.name } });
    if (!existing) {
      await prisma.service.create({ data: s });
    }
  }

  // Horarios laborales (Lunes a Sábado, domingo cerrado)
  const hours = [
    { dayOfWeek: 0, isOpen: false, openTime: '00:00', closeTime: '00:00' },
    { dayOfWeek: 1, isOpen: true, openTime: '09:00', closeTime: '19:00', breaks: [{ start: '14:00', end: '15:00' }] },
    { dayOfWeek: 2, isOpen: true, openTime: '09:00', closeTime: '19:00', breaks: [{ start: '14:00', end: '15:00' }] },
    { dayOfWeek: 3, isOpen: true, openTime: '09:00', closeTime: '19:00', breaks: [{ start: '14:00', end: '15:00' }] },
    { dayOfWeek: 4, isOpen: true, openTime: '09:00', closeTime: '19:00', breaks: [{ start: '14:00', end: '15:00' }] },
    { dayOfWeek: 5, isOpen: true, openTime: '09:00', closeTime: '20:00', breaks: [{ start: '14:00', end: '15:00' }] },
    { dayOfWeek: 6, isOpen: true, openTime: '09:00', closeTime: '17:00' },
  ];

  for (const h of hours) {
    await prisma.businessHours.upsert({
      where: { dayOfWeek: h.dayOfWeek },
      update: {},
      create: h as any,
    });
  }

  // Configuración general
  const settingsExists = await prisma.settings.findFirst();
  if (!settingsExists) {
    await prisma.settings.create({
      data: {
        businessName: 'BarberFlow',
        address: 'Av. Venustiano Carranza 123, Saltillo, Coahuila',
        phone: '+52 844 123 4567',
        email: 'contacto@barberflow.com',
        instagram: '@barberflow',
      },
    });
  }

  console.log('✅ Seed completado');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
