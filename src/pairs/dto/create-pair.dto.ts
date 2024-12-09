import { IsString, IsBoolean, IsInt, Min } from 'class-validator';

export class CreatePairDto {
  @IsString()
  baseCurrency: string;

  @IsString()
  quoteCurrency: string;

  @IsBoolean()
  isActive: boolean;

  @IsInt()
  @Min(1)
  updateInterval: number;
}
