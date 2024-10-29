import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Account } from '../../common/entities/account.entity';
import { Owner } from '../../common/entities/owner.entity';
import { Transaction } from '../../common/entities/transaction.entity';
import { Currency } from '../../common/entities/currency.entity';
import { UUID } from 'crypto';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
    @InjectRepository(Currency)
    private currencyRepository: Repository<Currency>
  ) {}

  async createAccount(dto: CreateAccountDto): Promise<Account> {
    const default_currency = await this.currencyRepository.findOne({
      where: { code: dto.default_currency },
    });

    const newAccount = this.accountRepository.create({
      ...dto,
      default_currency,
    });
    console.log(1);
    return await this.accountRepository.save(newAccount);
  }

  /**
   * Updates an existing account based on the provided ID and details.
   *
   * This function finds and updates the account by its UUID with the provided data,
   * and saves the changes to the repository. It then fetches and returns the updated account entity.
   *
   * @param {UUID} uuid - The ID of the account to be updated.
   * @param {UpdateOwnerDto} dto - Data Transfer Object containing the updated owner details.
   * @returns {Promise<Owner>} - A promise that resolves to the updated owner entity.
   * @throws {EntityNotFoundError} - Throws an error if the account or owner is not found.
   */
  async updateAccount(uuid: UUID, dto: UpdateAccountDto): Promise<Account> {
    // Update the owner entity with the provided details.
    await this.accountRepository.update(
      { uuid },
      { ...dto, date_updated: new Date() }
    );

    // Fetch and return the updated owner entity.
    return await this.accountRepository.findOneOrFail({
      where: { uuid },
    });
  }

  /**
   * Deletes an account based on the provided UUID.
   *
   * This function finds an account by its UUID, then removes it from the repository.
   *
   * @param {UUID} uuid - The UUID of the account to be deleted.
   * @returns {Promise<Account>} - A promise that resolves to the deleted acount.
   * @throws {EntityNotFoundError} - Throws an error if the account is not found.
   */
  async deleteAccount(uuid: UUID): Promise<Account> {
    // Fetch the account using the provided UUID and account UUID.
    const account: Account = await this.accountRepository.findOneOrFail({
      where: { uuid: uuid },
      relations: ['owners', 'transactions'],
    });

    // await this.accountRepository.manager.transaction(
// 
    //   async (transactionalEntityManager) => {
    //     // Batch delete all related transactions.
    //     if (account.transactions && account.transactions.length > 0) {
    //       await transactionalEntityManager
    //         .createQueryBuilder()
    //         .delete()
    //         .from(Transaction)
    //         .where({ account: account.id }) // Assuming transaction entity has a foreign key reference to account
    //         .execute();
    //     }

    //     // Batch delete all related owners.
    //     if (account.owners && account.owners.length > 0) {
    //       await transactionalEntityManager
    //         .createQueryBuilder()
    //         .delete()
    //         .from(Owner)
    //         .where({ account: account.id }) // Assuming owner entity has a foreign key reference to account
    //         .execute();
    //     }
    //   }
    // );
    // Remove the account from the repository and return the removed entity.
    return await this.accountRepository.remove(account);
  }
}
