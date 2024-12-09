import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ExternalRatesService {
  private readonly logger = new Logger(ExternalRatesService.name);

  async fetchRate(base: string, quote: string): Promise<number> {
    try {
      const url = `https://api.coingecko.com/api/v3/simple/price?ids=${base}&vs_currencies=${quote}`;
      const response = await axios.get(url);

      const rate = response.data[base.toLowerCase()][quote.toLowerCase()];
      this.logger.log(`Получен курс для ${base}/${quote}: ${rate}`);
      return rate;
    } catch (error) {
      this.logger.error(`Ошибка при получении курса для ${base}/${quote}: ${error.message}`);
      throw error;
    }
  }
}
