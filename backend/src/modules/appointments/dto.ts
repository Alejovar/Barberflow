import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEmail, IsOptional, IsString, Matches, MinLength } from 'class-validator';

const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

export class CreateAppointmentDto {
  @ApiProperty({ example: 'Juan Pérez' })
  @IsString()
  @MinLength(2)
  customerName: string;

  @ApiProperty({ example: 'juan@example.com' })
  @IsEmail()
  customerEmail: string;

  @ApiProperty({ example: '+52 844 111 2222' })
  @IsString()
  @MinLength(7)
  customerPhone: string;

  @ApiProperty({ example: 'uuid-del-servicio' })
  @IsString()
  serviceId: string;

  @ApiProperty({ example: '2026-07-15' })
  @IsDateString()
  date: string;

  @ApiProperty({ example: '10:30' })
  @Matches(TIME_REGEX, { message: 'startTime debe tener formato HH:mm' })
  startTime: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class RescheduleAppointmentDto {
  @ApiProperty({ example: '2026-07-16' })
  @IsDateString()
  date: string;

  @ApiProperty({ example: '11:00' })
  @Matches(TIME_REGEX, { message: 'startTime debe tener formato HH:mm' })
  startTime: string;
}

export class AvailabilityQueryDto {
  @ApiProperty({ example: 'uuid-del-servicio' })
  @IsString()
  serviceId: string;

  @ApiProperty({ example: '2026-07-15' })
  @IsDateString()
  date: string;
}

export class UpdateAppointmentStatusDto {
  @ApiProperty({ enum: ['PENDING', 'CONFIRMED', 'FINISHED', 'CANCELLED'] })
  @IsString()
  status: 'PENDING' | 'CONFIRMED' | 'FINISHED' | 'CANCELLED';
}
