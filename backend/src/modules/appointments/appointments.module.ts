import { Module } from '@nestjs/common';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';
import { ServicesModule } from '../services/services.module';
import { BusinessHoursModule } from '../business-hours/business-hours.module';
import { HolidaysModule } from '../holidays/holidays.module';
import { EmailModule } from '../email/email.module';
import { SettingsModule } from '../settings/settings.module';

@Module({
  imports: [ServicesModule, BusinessHoursModule, HolidaysModule, EmailModule, SettingsModule],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
  exports: [AppointmentsService],
})
export class AppointmentsModule {}
