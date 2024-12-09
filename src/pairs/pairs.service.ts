import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CryptoPair } from './entities/crypto-pair.entity';
import { CreatePairDto } from './dto/create-pair.dto';
import { UpdatePairDto } from './dto/update-pair.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ExternalRatesService } from '../rates/external-rates.service';
import { RatesService } from '../rates/rates.service';

@Injectable()
export class PairsService {
  private readonly logger = new Logger(PairsService.name);

  constructor(
    @InjectRepository(CryptoPair)
    private pairsRepository: Repository<CryptoPair>,
    private externalRatesService: ExternalRatesService,
    private ratesService: RatesService,
  ) {}

  create(createPairDto: CreatePairDto) {
    const pair = this.pairsRepository.create(createPairDto);
    return this.pairsRepository.save(pair);
  }

  findAll() {
    return this.pairsRepository.find();
  }

  async update(id: number, updatePairDto: UpdatePairDto) {
    await this.pairsRepository.update(id, updatePairDto);
    return this.pairsRepository.findOneBy({ id });
  }

  delete(id: number) {
    return this.pairsRepository.delete(id);
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async updateRates() {
    this.logger.log('Запуск обновления курсов криптовалют...');
    const pairs = await this.findAll();

    for (const pair of pairs) {
      if (pair.isActive) {
        try {
          this.logger.log(`Получение курса для ${pair.baseCurrency}/${pair.quoteCurrency}`);
          const rate = await this.externalRatesService.fetchRate(
            pair.baseCurrency.toLowerCase(),
            pair.quoteCurrency.toLowerCase(),
          );

          await this.ratesService.saveRate({
            pairId: pair.id,
            rate,
            timestamp: new Date(),
          });

          this.logger.log(`Курс сохранен: ${pair.baseCurrency}/${pair.quoteCurrency} - ${rate}`);
        } catch (error) {
          this.logger.error(`Ошибка при обновлении курса для ${pair.baseCurrency}/${pair.quoteCurrency}: ${error.message}`);
        }
      }
    }
  }
}
