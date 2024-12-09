// src/rates/rates.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RatesController } from './rates.controller';
import { RatesService } from './rates.service';
import { CryptoRate } from './entities/crypto-rate.entity';
import { CryptoPair } from '../pairs/entities/crypto-pair.entity';
import { ExternalRatesService } from './external-rates.service';

@Module({
  imports: [TypeOrmModule.forFeature([CryptoRate, CryptoPair])],
  controllers: [RatesController],
  providers: [RatesService, ExternalRatesService],
  exports: [RatesService, ExternalRatesService],
})
export class RatesModule {}
