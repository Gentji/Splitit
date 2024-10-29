import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { CreateOwnerDto } from './dto/create-owner.dto';
import { OwnersService } from './owners.service';
import { ResponseWrapper } from '../../common/dto/response-wrapper.dto';
import { Owner } from '../../common/entities/owner.entity';
import { UUID } from 'crypto';
import { DeleteOwnerDto } from './dto/delete-owner.dto';
import { UpdateOwnerDto } from './dto/update-owner.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Accounts')
@Controller()
export class OwnersController {
  constructor(private readonly ownersService: OwnersService) {}

  /**
   * Creates a new owner for a specified account.
   *
   * This endpoint creates a new owner entity associated with the provided account UUID and details,
   * then returns a response wrapper.
   *
   * @param {CreateOwnerDto} createOwnerDto - Data Transfer Object containing the account UUID and owner details.
   * @returns {ResponseWrapper<Owner>} - A response wrapper with the created owner.
   * @throws {EntityNotFoundError} - Throws an error if the account is not found.
   */
  @Post('/owner')
  @ApiOperation({ summary: 'Create a new owner' })
  async createOwner(
    @Body() createOwnerDto: CreateOwnerDto
  ): Promise<ResponseWrapper<Owner>> {
    // Create a new owner using the provided DTO.
    const newOwner = await this.ownersService.createOwner(createOwnerDto);

    // Return a response wrapper with a success message and the created owner.
    return new ResponseWrapper<Owner>(
      'success',
      'Owner created successfully',
      newOwner
    );
  }

  /**
   * Updates an existing owner based on the provided ID and details.
   *
   * This endpoint updates an owner entity with the provided data,
   * then returns a response wrapper.
   *
   * @param {number} ownerId - The ID of the owner to be updated.
   * @param {UpdateOwnerDto} updateOwnerDto - Data Transfer Object containing the updated owner details.
   * @returns {ResponseWrapper<UpdateOwnerDto>} - A response wrapper with the updated owner details.
   */
  @Patch('/owner/:id')
  @ApiOperation({ summary: 'Update owner details' })
  async updateOwner(
    @Param('id') ownerId: number,
    @Body() updateOwnerDto: UpdateOwnerDto
  ): Promise<ResponseWrapper<UpdateOwnerDto>> {
    // Update the owner using the provided ID and DTO.
    const updatedOwner = await this.ownersService.updateOwner(
      ownerId,
      updateOwnerDto
    );

    // Return a response wrapper with a success message and the updated owner details.
    return new ResponseWrapper<UpdateOwnerDto>(
      'success',
      'Owner updated successfully',
      updateOwnerDto
    );
  }

  /**
   * Retrieves an owner based on the provided ID and account UUID.
   *
   * This endpoint fetches an owner by its ID and associated account UUID, then returns a response wrapper.
   *
   * @param {number} id - The ID of the owner to be retrieved.
   * @param {UUID} accountUuid - The UUID of the account associated with the owner.
   * @returns {ResponseWrapper<Owner>} - A response wrapper with the retrieved owner.
   * @throws {EntityNotFoundError} - Throws an error if the owner is not found.
   */
  @Get('/owner/:id/:accountUuid')
  @ApiOperation({ summary: 'Get owner details by ID and account UUID' })
  async getTransaction(
    @Param('id') id: number,
    @Param('accountUuid') accountUuid: UUID
  ): Promise<ResponseWrapper<Owner>> {
    // Fetch the owner using the provided ID and account UUID.
    const newTransaction = await this.ownersService.getOwner(id, accountUuid);

    // Return a response wrapper with a success message and the retrieved owner.
    return new ResponseWrapper<Owner>(
      'success',
      'Owner found successfully',
      newTransaction
    );
  }

  /**
   * Deletes an owner based on the provided ID and account UUID.
   *
   * This endpoint deletes an owner by its ID and associated account UUID, then returns a response wrapper.
   *
   * @param {number} transactionId - The ID of the owner to be deleted.
   * @param {DeleteOwnerDto} deleteTransactionDto - Data Transfer Object containing the account UUID.
   * @returns {ResponseWrapper<DeleteOwnerDto>} - A response wrapper with the deletion result.
   * @throws {EntityNotFoundError} - Throws an error if the owner is not found.
   */
  @Delete('/owner/:id')
  @ApiOperation({ summary: 'Delete an owner by ID' })
  async DeleteTransaction(
    @Param('id') transactionId: number,
    @Body() deleteTransactionDto: DeleteOwnerDto
  ): Promise<ResponseWrapper<DeleteOwnerDto>> {
    // Delete the owner using the provided ID and account UUID.
    const deletedTransaction = await this.ownersService.deleteOwner(
      transactionId,
      deleteTransactionDto
    );

    // Return a response wrapper with a success message and the DTO.
    return new ResponseWrapper<DeleteOwnerDto>(
      'success',
      'Owner deleted successfully',
      deleteTransactionDto
    );
  }
}
