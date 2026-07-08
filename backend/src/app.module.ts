import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ServicesModule } from './modules/services/services.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { BusinessHoursModule } from './modules/business-hours/business-hours.module';
import { HolidaysModule } from './modules/holidays/holidays.module';
import { SettingsModule } from './modules/settings/settings.module';
import { EmailModule } from './modules/email/email.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([
      {
        ttl: Number(process.env.THROTTLE_TTL || 60) * 1000,
        limit: Number(process.env.THROTTLE_LIMIT || 10),
      },
    ]),
    PrismaModule,
    AuthModule,
    UsersModule,
    ServicesModule,
    AppointmentsModule,
    BusinessHoursModule,
    HolidaysModule,
    SettingsModule,
    EmailModule,
    HealthModule,
  ],
})
export class AppModule {}
