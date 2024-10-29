import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { DeleteTransactionDto } from './dto/delete-transaction.dto';
import { Account } from '../../common/entities/account.entity';
import { Transaction } from '../../common/entities/transaction.entity';
import { Currency } from '../../common/entities/currency.entity';
import { UUID } from 'crypto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(Currency)
    private currencyRepository: Repository<Currency>
  ) {}

  /**
   * Retrieves a transaction based on the provided ID and account UUID.
   *
   * This function fetches a transaction by its ID and account UUID from the repository.
   *
   * @param {number} id - The ID of the transaction to be retrieved.
   * @param {UUID} accountUuid - The UUID of the account associated with the transaction.
   * @returns {Promise<Transaction>} - A promise that resolves to the retrieved transaction.
   * @throws {EntityNotFoundError} - Throws an error if the transaction is not found.
   */
  async getTransaction(id: number, accountUuid: UUID): Promise<Transaction> {
    // Fetch the transaction using the provided ID and account UUID.
    const transaction: Transaction =
      await this.transactionRepository.findOneOrFail({
        where: { id: id, account_uuid: accountUuid },
      });

    // Return the retrieved transaction.
    return transaction;
  }

  /**
   * Retrieves transactions for a specified account UUID.
   *
   * This function fetches the account by its UUID and returns its associated transactions.
   *
   * @param {UUID} accountUuid - The UUID of the account whose transactions are to be retrieved.
   * @returns {Promise<Transaction[]>} - A promise that resolves to an array of transactions.
   * @throws {EntityNotFoundError} - Throws an error if the account is not found.
   */
  async getAccountTransactions(accountUuid: UUID): Promise<Transaction[]> {
    // Fetch the account along with its transactions using the provided UUID.
    const account: Account = await this.accountRepository.findOneOrFail({
      where: { uuid: accountUuid },
      relations: ['transactions'],
    });

    // Extract and return the transactions from the account.
    return account.transactions;
  }

  /**
   * Creates a new transaction for a specified account.
   *
   * This function finds the account and currency by their identifiers, creates a new transaction entity,
   * and saves it to the repository.
   *
   * @param {CreateTransactionDto} dto - Data Transfer Object containing the transaction details.
   * @returns {Promise<Transaction>} - A promise that resolves to the created transaction.
   * @throws {EntityNotFoundError} - Throws an error if the account or currency is not found.
   */
  async createTransaction(dto: CreateTransactionDto): Promise<Transaction> {
    // Fetch the account using the provided account UUID.
    const account: Account = await this.accountRepository.findOneOrFail({
      where: { uuid: dto.account_uuid },
    });

    // Fetch the currency using the provided currency code.
    const currency: Currency = await this.currencyRepository.findOneOrFail({
      where: { code: dto.currency },
    });

    // Create a new transaction entity and associate it with the fetched account and currency.
    const newTransaction = this.transactionRepository.create({
      ...dto,
      account,
      currency,
    });

    // Save the new transaction to the repository and return the saved entity.
    return await this.transactionRepository.save(newTransaction);
  }

  /**
   * Updates an existing transaction based on the provided ID and details.
   *
   * This function finds the account and currency by their identifiers, updates the transaction entity,
   * and saves the changes to the repository.
   *
   * @param {number} id - The ID of the transaction to be updated.
   * @param {UpdateTransactionDto} dto - Data Transfer Object containing the updated transaction details.
   * @returns {Promise<Transaction>} - A promise that resolves to the updated transaction.
   * @throws {EntityNotFoundError} - Throws an error if the account, currency, or transaction is not found.
   */
  async updateTransaction(
    id: number,
    dto: UpdateTransactionDto
  ): Promise<Transaction> {
    // Fetch the account using the provided account UUID.
    const account: Account = await this.accountRepository.findOneOrFail({
      where: { uuid: dto.account_uuid },
    });

    // Update the transaction entity with the provided details.
    await this.transactionRepository.update(id, {
      ...dto,
      account,
      date_updated: new Date(),
    });

    // Fetch and return the updated transaction entity.
    return await this.transactionRepository.findOneOrFail({
      where: { id, account_uuid: dto.account_uuid },
    });
  }

  /**
   * Deletes a transaction based on the provided ID and account UUID.
   *
   * This function finds a transaction by its ID and account UUID, then removes it from the repository.
   *
   * @param {number} id - The ID of the transaction to be deleted.
   * @param {DeleteTransactionDto} dto - Data Transfer Object containing the account UUID.
   * @returns {Promise<Transaction>} - A promise that resolves to the deleted transaction.
   * @throws {EntityNotFoundError} - Throws an error if the transaction is not found.
   */
  async deleteTransaction(
    id: number,
    dto: DeleteTransactionDto
  ): Promise<Transaction> {
    // Fetch the transaction using the provided ID and account UUID.
    const transaction: Transaction =
      await this.transactionRepository.findOneOrFail({
        where: { id: id, account_uuid: dto.account_uuid },
      });

    // Remove the transaction from the repository and return the removed entity.
    return await this.transactionRepository.remove(transaction);
  }
}
