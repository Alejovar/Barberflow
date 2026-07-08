import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { BusinessHoursService } from './business-hours.service';
import { UpdateBusinessHoursDto } from './dto';
import { Public } from '../../common/decorators/public.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('business-hours')
@Controller('business-hours')
export class BusinessHoursController {
  constructor(private service: BusinessHoursService) {}

  @Public()
  @Get()
  findAll() {
    return this.service.findAll();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put()
  upsert(@Body() dto: UpdateBusinessHoursDto) {
    return this.service.upsert(dto);
  }
}
