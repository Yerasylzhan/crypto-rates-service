import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('crypto_pairs')
export class CryptoPair {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  baseCurrency: string;

  @Column()
  quoteCurrency: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'int', default: 10 })
  updateInterval: number;
}
