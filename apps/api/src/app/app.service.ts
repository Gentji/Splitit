import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAccountDto } from '../modules/accounts/dto/create-account.dto';
import { CreateOwnerDto } from '../modules/owners/dto/create-owner.dto';
import { CreateTransactionDto } from '../modules/transactions/dto/create-transaction.dto';
import { Account } from '../common/entities/account.entity';
import { Transaction } from '../common/entities/transaction.entity';
import { Owner } from '../common/entities/owner.entity';
import { Currency } from '../common/entities/currency.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(Owner)
    private ownerRepository: Repository<Owner>,
    @InjectRepository(Currency)
    private currencyRepository: Repository<Currency>
  ) {}
  getData(): { message: string } {
    return { message: 'Hello API' };
  }
}
