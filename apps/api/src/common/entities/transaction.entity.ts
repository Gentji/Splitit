import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  BeforeUpdate
} from 'typeorm';
import { Account } from './account.entity';
import { Currency } from './currency.entity';
import { Expose } from 'class-transformer';
import { UUID } from 'crypto';

interface SharingInfo {
  method: SharingMethod;
  shared_with: { id: number; take?: number }[];
}

export enum SharingMethod {
  EQUALLY = 'equally',
  SHARES = 'shares',
  AMOUNTS = 'amounts',
}

export enum TransactionType {
  EXPENSE = 'expense',
  INCOME = 'income',
  TRANSFER = 'transfer',
}

@Entity('transaction')
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date_inserted: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date_updated: Date;

  @Column({ type: 'json' })
  sharing_info: SharingInfo;

  @ManyToOne(() => Account, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'account_uuid', referencedColumnName: 'uuid' })
  account: Account;

  @Column({ type: 'uuid' })
  account_uuid: UUID;

  @Column({
    type: 'enum',
    enum: TransactionType,
    default: 'expense',
  })
  type: string;

  @ManyToOne(() => Currency, { eager: true })
  @JoinColumn({ name: 'currency_id' })
  currency: Currency;

  @Column({ type: 'double precision', nullable: true })
  amount: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @BeforeUpdate()
  updateTimestamp() {
    this.date_updated = new Date();
  }
}
