import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CryptoRate } from './entities/crypto-rate.entity';
import { GetRatesFilterDto } from './dto/get-rates-filter.dto';
import { CryptoPair } from '../pairs/entities/crypto-pair.entity';

@Injectable()
export class RatesService {
    private readonly logger = new Logger(RatesService.name);

  constructor(
    @InjectRepository(CryptoRate)
    private ratesRepository: Repository<CryptoRate>,

    @InjectRepository(CryptoPair)
    private pairsRepository: Repository<CryptoPair>,
  ) {}


  async findWithFilters(filterDto: GetRatesFilterDto) {
    const { baseCurrency, quoteCurrency, fromDate, toDate, limit, sort } = filterDto;

    const query = this.ratesRepository.createQueryBuilder('rate');

    if (baseCurrency && quoteCurrency) {
      const pair = await this.pairsRepository.findOne({
        where: { baseCurrency, quoteCurrency },
      });
      if (pair) {
        query.andWhere('rate.pairId = :pairId', { pairId: pair.id });
      } else {
        return [];
      }
    }

    if (fromDate) {
      query.andWhere('rate.timestamp >= :fromDate', { fromDate });
    }

    if (toDate) {
      query.andWhere('rate.timestamp <= :toDate', { toDate });
    }

    if (sort) {
      query.orderBy('rate.timestamp', sort.toUpperCase() as 'ASC' | 'DESC');
    } else {
      query.orderBy('rate.timestamp', 'DESC');
    }

    if (limit) {
      query.limit(limit);
    }

    try {
      const rates = await query.getMany();
      this.logger.log(`Найдено ${rates.length} курсов`);
      return rates;
    } catch (error) {
      this.logger.error(`Ошибка при получении курсов: ${error.message}`);
      return [];
    }
  }

  async findLatestRates() {
    const activePairs = await this.pairsRepository.find({ where: { isActive: true } });
    const latestRates = await Promise.all(
      activePairs.map(async (pair) => {
        const latestRate = await this.ratesRepository.findOne({
          where: { pairId: pair.id },
          order: { timestamp: 'DESC' },
        });
        return {
          pair: `${pair.baseCurrency}/${pair.quoteCurrency}`,
          rate: latestRate ? latestRate.rate : null,
          timestamp: latestRate ? latestRate.timestamp : null,
        };
      }),
    );
    return latestRates;
  }

  async saveRate(data: { pairId: number; rate: number; timestamp: Date }) {
    const entity = this.ratesRepository.create(data);
    return this.ratesRepository.save(entity);
  }
}
