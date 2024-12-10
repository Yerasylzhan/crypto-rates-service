import { IsOptional, IsString, IsDateString, IsInt, Min, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class GetRatesFilterDto {
  @IsOptional()
  @IsString()
  baseCurrency?: string;

  @IsOptional()
  @IsString()
  quoteCurrency?: string;

  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @IsOptional()
  @IsDateString()
  toDate?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  pairId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;

  @IsOptional()
  @IsString()
  sort?: 'asc' | 'desc';
}
