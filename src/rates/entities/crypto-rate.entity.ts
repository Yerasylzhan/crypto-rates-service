import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('crypto_rates')
export class CryptoRate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  pairId: number;

  @Column('float')
  rate: number;

  @Column({ type: 'timestamp' })
  timestamp: Date;
}
