import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { CurrencyCode, CurrencyName } from './currency.enum';

@Entity('currency')
export class Currency {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  date_inserted: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  date_updated: Date;

  @Column({
    type: 'varchar',
    enum: CurrencyName,
    nullable: false,
  })
  name: CurrencyName;

  @Column({
    type: 'enum',
    enum: CurrencyCode,
    nullable: false,
  })
  code: CurrencyCode;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  symbol: string;

  @Column({
    type: 'float',
    nullable: true,
  })
  cad_rate: number;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  rate_date: Date;
}
