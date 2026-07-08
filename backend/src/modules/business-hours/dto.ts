import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class UpdateBusinessHoursDto {
  @ApiProperty({ example: 1, description: '0=Domingo ... 6=Sábado' })
  @IsInt()
  @Min(0)
  @Max(6)
  dayOfWeek: number;

  @ApiProperty()
  @IsBoolean()
  isOpen: boolean;

  @ApiProperty({ example: '09:00' })
  @IsString()
  openTime: string;

  @ApiProperty({ example: '19:00' })
  @IsString()
  closeTime: string;

  @ApiProperty({ required: false, description: 'Lista de descansos [{start, end}]' })
  @IsOptional()
  breaks?: { start: string; end: string }[];
}
