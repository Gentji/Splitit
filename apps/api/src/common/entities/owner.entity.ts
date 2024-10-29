import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique, BeforeUpdate } from 'typeorm';
import { Account } from './account.entity';

@Entity('owner')
@Unique(['name', 'account'])
export class Owner {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date_inserted: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date_updated: Date;

  @ManyToOne(() => Account, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'account_uuid', referencedColumnName: 'uuid' })
  account: Account;

  @Column({ type: 'uuid' })
  account_uuid: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @BeforeUpdate()
  updateTimestamp() {
    this.date_updated = new Date();
  }
}