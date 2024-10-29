import {
  Controller,
  Patch,
  Delete,
  Post,
  Get,
  Body,
  Param,
} from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { DeleteTransactionDto } from './dto/delete-transaction.dto';
import { TransactionsService } from './transactions.service';
import { ResponseWrapper } from '../../common/dto/response-wrapper.dto';
import { Transaction } from '../../common/entities/transaction.entity';
import { UUID } from 'crypto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Transactions')
@Controller()
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  /**
   * Creates a new transaction.
   *
   * This endpoint creates a new transaction entity based on the provided data,
   * then returns a response wrapper.
   *
   * @param {CreateTransactionDto} createTransactionDto - Data Transfer Object containing the transaction details.
   * @returns {ResponseWrapper<Transaction>} - A response wrapper with the created transaction.
   */
  @Post('/transaction')
  @ApiOperation({ summary: 'Create a new transaction' })
  async createTransaction(
    @Body() createTransactionDto: CreateTransactionDto
  ): Promise<ResponseWrapper<Transaction>> {
    // Create a new transaction using the provided DTO.
    const newTransaction = await this.transactionsService.createTransaction(
      createTransactionDto
    );

    // Return a response wrapper with a success message and the created transaction.
    return new ResponseWrapper<Transaction>(
      'success',
      'Transaction created successfully',
      newTransaction
    );
  }

  /**
   * Updates an existing transaction based on the provided ID and details.
   *
   * This endpoint updates a transaction entity with the provided data,
   * then returns a response wrapper.
   *
   * @param {number} transactionId - The ID of the transaction to be updated.
   * @param {UpdateTransactionDto} updateTransactionDto - Data Transfer Object containing the updated transaction details.
   * @returns {ResponseWrapper<UpdateTransactionDto>} - A response wrapper with the updated transaction details.
   */
  @Patch('/transaction/:id')
  @ApiOperation({ summary: 'Update transaction details' })
  async updateTransaction(
    @Param('id') transactionId: number,
    @Body() updateTransactionDto: UpdateTransactionDto
  ): Promise<ResponseWrapper<UpdateTransactionDto>> {
    // Update the transaction using the provided ID and DTO.
    const updatedTransaction = await this.transactionsService.updateTransaction(
      transactionId,
      updateTransactionDto
    );

    // Return a response wrapper with a success message and the updated transaction details.
    return new ResponseWrapper<UpdateTransactionDto>(
      'success',
      'Transaction updated successfully',
      updateTransactionDto
    );
  }

  /**
   * Retrieves a transaction based on the provided ID and account UUID.
   *
   * This endpoint fetches a transaction by its ID and account UUID,
   * then returns a response wrapper.
   *
   * @param {number} id - The ID of the transaction to be retrieved.
   * @param {UUID} accountUuid - The UUID of the account associated with the transaction.
   * @returns {ResponseWrapper<Transaction>} - A response wrapper with the retrieved transaction.
   */
  @Get('/transaction/:id/:accountUuid')
  @ApiOperation({ summary: 'Get transaction details by ID and account UUID' })
  async getTransaction(
    @Param('id') id: number,
    @Param('accountUuid') accountUuid: UUID
  ): Promise<ResponseWrapper<Transaction>> {
    // Fetch the transaction using the provided ID and account UUID.
    const transaction = await this.transactionsService.getTransaction(
      id,
      accountUuid
    );

    // Return a response wrapper with a success message and the retrieved transaction.
    return new ResponseWrapper<Transaction>(
      'success',
      'Transaction found successfully',
      transaction
    );
  }

  /**
   * Retrieves transactions for a specified account UUID.
   *
   * This endpoint fetches the transactions associated with a given account UUID,
   * then returns a response wrapper.
   *
   * @param {UUID} accountUuid - The UUID of the account whose transactions are to be retrieved.
   * @returns {ResponseWrapper<Transaction[]>} - A response wrapper with the transactions of the account.
   */
  @Get('/transaction/:accountUuid')
  @ApiOperation({ summary: 'Get all transactions for an account by account UUID' })
  async getAccountTransactions(
    @Param('accountUuid') accountUuid: UUID
  ): Promise<ResponseWrapper<Transaction[]>> {
    // Fetch the transactions associated with the provided account UUID.
    const transactions = await this.transactionsService.getAccountTransactions(
      accountUuid
    );

    // Return a response wrapper with a success message and the retrieved transactions.
    return new ResponseWrapper<Transaction[]>(
      'success',
      'Transactions found successfully',
      transactions
    );
  }

  /**
   * Deletes a transaction based on the provided ID and account UUID.
   *
   * This endpoint deletes a transaction by its ID and account UUID,
   * then returns a response wrapper.
   *
   * @param {number} transactionId - The ID of the transaction to be deleted.
   * @param {DeleteTransactionDto} deleteTransactionDto - Data Transfer Object containing the account UUID.
   * @returns {ResponseWrapper<DeleteTransactionDto>} - A response wrapper with the deleted transaction details.
   */
  @Delete('/transaction/:id')
  @ApiOperation({ summary: 'Delete a transaction by ID' })
  async DeleteTransactionDto(
    @Param('id') transactionId: number,
    @Body() deleteTransactionDto: DeleteTransactionDto
  ): Promise<ResponseWrapper<DeleteTransactionDto>> {
    // Delete the transaction using the provided ID and DTO.
    const deletedTransaction = await this.transactionsService.deleteTransaction(
      transactionId,
      deleteTransactionDto
    );

    // Return a response wrapper with a success message and the deleted transaction details.
    return new ResponseWrapper<DeleteTransactionDto>(
      'success',
      'Transaction deleted successfully',
      deleteTransactionDto
    );
  }
}
