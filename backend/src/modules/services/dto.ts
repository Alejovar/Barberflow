import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNumber, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class CreateServiceDto {
  @ApiProperty({ example: 'Corte Clásico' })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({ example: 'Corte de cabello tradicional con tijera y máquina.' })
  @IsString()
  @MinLength(5)
  description: string;

  @ApiProperty({ example: 30, description: 'Duración en minutos' })
  @IsInt()
  @Min(5)
  duration: number;

  @ApiProperty({ example: 150 })
  @IsNumber()
  @Min(0)
  price: number;
}

export class UpdateServiceDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MinLength(5)
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Min(5)
  duration?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
