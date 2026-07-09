import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdateSettingsDto {
  // El frontend reenvía el objeto completo que recibió del GET, que
  // incluye id/updatedAt (generados por la base de datos). Se aceptan
  // aquí para que el ValidationPipe (forbidNonWhitelisted: true) no
  // rechace el request completo, pero se descartan explícitamente en
  // SettingsService.update() — nunca se usan para escribir en BD.
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  updatedAt?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  businessName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  logoUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  instagram?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  facebook?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  whatsapp?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  cancelWindowHours?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  rescheduleWindowHours?: number;
}