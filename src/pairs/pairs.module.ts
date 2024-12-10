import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PairsController } from './pairs.controller';
import { PairsService } from './pairs.service';
import { CryptoPair } from './entities/crypto-pair.entity';
import { RatesModule } from '../rates/rates.module';

@Module({
  imports: [TypeOrmModule.forFeature([CryptoPair]), RatesModule],
  controllers: [PairsController],
  providers: [PairsService],
  exports: [PairsService],
})
export class PairsModule {}
