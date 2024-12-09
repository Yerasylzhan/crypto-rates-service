import { Controller, Get, Query } from '@nestjs/common';
import { RatesService } from './rates.service';
import { GetRatesFilterDto } from './dto/get-rates-filter.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('rates')
@Controller('rates')
export class RatesController {
  constructor(private readonly ratesService: RatesService) {}

  @Get()
  @ApiOperation({ summary: 'Получить курсы с фильтрацией' })
  getRates(@Query() filterDto: GetRatesFilterDto) {
    return this.ratesService.findWithFilters(filterDto);
  }

  @Get('latest')
  @ApiOperation({ summary: 'Получить самые последние курсы для всех пар' })
  getLatestRates() {
    return this.ratesService.findLatestRates();
  }
}
