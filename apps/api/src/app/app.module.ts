import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service';

import { AccountsController } from '../modules/accounts/accounts.controller';
import { TransactionsController } from '../modules/transactions/transactions.controller';
import { OwnersController } from '../modules/owners/owners.controller';

import { Account } from '../common/entities/account.entity';
import { Owner } from '../common/entities/owner.entity';
import { Transaction } from '../common/entities/transaction.entity';
import { Currency } from '../common/entities/currency.entity';

import { AccountsService } from '../modules/accounts/accounts.service';
import { TransactionsService } from '../modules/transactions/transactions.service';
import { OwnersService } from '../modules/owners/owners.service';

import { SharedInfoValidator } from '../common/validators/shared-info.validator';
console.log(process.env);
@Module({
  controllers: [AccountsController, TransactionsController, OwnersController],
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.TYPEORM_HOST,
      port: parseInt(process.env.TYPEORM_PORT, 10) || 5432,
      username: process.env.TYPEORM_USERNAME,
      password: process.env.TYPEORM_PASSWORD,
      database: process.env.TYPEORM_DATABASE,
      entities: [Account, Owner, Transaction, Currency],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Account, Owner, Transaction, Currency])
  ],

  providers: [
    AppService,
    AccountsService,
    TransactionsService,
    OwnersService,
    SharedInfoValidator,
  ],
  exports: [AppService, AccountsService, TransactionsService, OwnersService],
})
export class AppModule {}