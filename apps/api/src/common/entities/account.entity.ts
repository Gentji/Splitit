import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, OneToMany, OneToOne, JoinColumn, ManyToOne, BeforeUpdate } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Transaction } from './transaction.entity';
import { Owner } from './owner.entity';
import { Currency } from './currency.entity';
import { CurrencyCode } from './currency.enum';
import { UUID } from 'crypto';
import { ApiProperty } from '@nestjs/swagger';

@Entity('account')
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid', unique: true })
  uuid: UUID;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date_inserted: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date_updated: Date;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;
  
  @ManyToOne(() => Currency, { eager: true })
  @JoinColumn({ name: 'default_currency_id' })
  default_currency: Currency;

  @Column({ type: 'number', name: 'default_currency_id'})
  default_currency_id: number;

  @OneToMany(() => Transaction, transaction => transaction.account)
  transactions: Transaction[];

  @OneToMany(() => Owner, owner => owner.account)
  owners: Owner[];

  @BeforeInsert()
  generateUUID() {
    this.uuid = uuidv4();
  }

  @BeforeUpdate()
  updateTimestamp() {
    this.date_updated = new Date();
  }
}
