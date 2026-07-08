import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AppointmentsService } from './appointments.service';
import {
  AvailabilityQueryDto,
  CreateAppointmentDto,
  RescheduleAppointmentDto,
  UpdateAppointmentStatusDto,
} from './dto';
import { Public } from '../../common/decorators/public.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('appointments')
@Controller('appointments')
export class AppointmentsController {
  constructor(private service: AppointmentsService) {}

  // ---- Público: flujo de reservación ----

  @Public()
  @Get('availability')
  getAvailability(@Query() query: AvailabilityQueryDto) {
    return this.service.getAvailability(query.serviceId, query.date);
  }

  @Public()
  @Post()
  create(@Body() dto: CreateAppointmentDto) {
    return this.service.create(dto);
  }

  @Public()
  @Get('token/:token')
  findByToken(@Param('token') token: string) {
    return this.service.findByToken(token);
  }

  @Public()
  @Patch('token/:token/cancel')
  cancel(@Param('token') token: string) {
    return this.service.cancelByToken(token);
  }

  @Public()
  @Patch('token/:token/reschedule')
  reschedule(@Param('token') token: string, @Body() dto: RescheduleAppointmentDto) {
    return this.service.rescheduleByToken(token, dto);
  }

  // ---- Administración ----

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query('from') from?: string, @Query('to') to?: string, @Query('status') status?: string) {
    return this.service.findAll({ from, to, status });
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('stats/dashboard')
  getDashboardStats() {
    return this.service.getDashboardStats();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateAppointmentStatusDto) {
    return this.service.updateStatus(id, dto.status);
  }
}
