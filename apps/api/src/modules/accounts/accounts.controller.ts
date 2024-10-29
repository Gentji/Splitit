import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { AccountsService } from './accounts.service';
import { ResponseWrapper } from '../../common/dto/response-wrapper.dto';
import { Account } from '../../common/entities/account.entity';
import { UpdateAccountDto } from './dto/update-account.dto';
import { UUID } from 'crypto';
import { DeleteAccountDto } from './dto/delete-account.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Owners')
@Controller()
export class AccountsController {
  constructor(private readonly accountService: AccountsService) {}

  @Post('/account')
  @ApiOperation({ summary: 'Create a new account' })
  async createAccount(@Body() createAccountDto: CreateAccountDto) {
    const newAccount = await this.accountService.createAccount(
      createAccountDto
    );
    return new ResponseWrapper<Account>(
      'success',
      'Account created successfully',
      newAccount
    );
  }

  /**
   * Updates an existing account based on the provided ID and details.
   *
   * This endpoint updates an account entity with the provided data,
   * then returns a response wrapper.
   *
   * @param {UUID} uuid - The UUID of the account to be updated.
   * @param {UpdateTransactionDto} updateTransactionDto - Data Transfer Object containing the updated account details.
   * @returns {ResponseWrapper<UpdateAccountDto>} - A response wrapper with the updated account details.
   */
  @Patch('/account/:uuid')
  @ApiOperation({ summary: 'Update account details' })
  async updateAccount(
    @Param('uuid') uuid: UUID,
    @Body() dto: UpdateAccountDto
  ): Promise<ResponseWrapper<UpdateAccountDto>> {
    // Update the account using the provided UUID and DTO.
    const updatedAccount = await this.accountService.updateAccount(uuid, dto);

    // Return a response wrapper with a success message and the updated transaction details.
    return new ResponseWrapper<UpdateAccountDto>(
      'success',
      'Account updated successfully',
      updatedAccount
    );
  }

  /**
   * Deletes an account based on the provided UUID.
   *
   * This endpoint deletes an account by its UUID, then returns a response wrapper.
   *
   * @param {uuid} uuid - The ID of the account to be deleted.
   * @returns {ResponseWrapper<DeleteAccountDto>} - A response wrapper with the deleted transaction details.
   */
  @Delete('/account/:uuid')
  @ApiOperation({ summary: 'Delete an account by UUID' })
  async DeleteAccountDto(
    @Param('uuid') uuid: UUID
  ): Promise<ResponseWrapper<DeleteAccountDto>> {
    // Delete the transaction using the provided ID and DTO.
    const deletedAccount = await this.accountService.deleteAccount(uuid);

    // Return a response wrapper with a success message and the deleted transaction details.
    return new ResponseWrapper<DeleteAccountDto>(
      'success',
      'Account deleted successfully',
      deletedAccount
    );
  }
}
