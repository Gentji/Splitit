import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOwnerDto } from './dto/create-owner.dto';
import { Account } from '../../common/entities/account.entity';
import { Owner } from '../../common/entities/owner.entity';
import { UUID } from 'crypto';
import { DeleteOwnerDto } from './dto/delete-owner.dto';
import { UpdateOwnerDto } from './dto/update-owner.dto';

@Injectable()
export class OwnersService {
  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
    @InjectRepository(Owner)
    private ownerRepository: Repository<Owner>
  ) {}

  /**
   * Creates a new owner for a specified account.
   *
   * This function finds the account by its UUID, creates a new owner entity associated with that account,
   * and saves it to the repository.
   *
   * @param {CreateOwnerDto} dto - Data Transfer Object containing the account UUID and owner details.
   * @returns {Promise<Owner>} - A promise that resolves to the created owner.
   * @throws {EntityNotFoundError} - Throws an error if the account is not found.
   */
  async createOwner(dto: CreateOwnerDto): Promise<Owner> {
    // Fetch the account using the provided account UUID.
    const account = await this.accountRepository.findOneOrFail({
      where: { uuid: dto.account_uuid },
    });

    // Create a new owner entity and associate it with the fetched account.
    const newOwner = this.ownerRepository.create({
      ...dto,
      account,
    });

    // Save the new owner to the repository and return the saved entity.
    return await this.ownerRepository.save(newOwner);
  }

  /**
   * Updates an existing owner based on the provided ID and details.
   *
   * This function finds the account by its UUID, updates the owner entity with the provided data,
   * and saves the changes to the repository. It then fetches and returns the updated owner entity.
   *
   * @param {number} id - The ID of the owner to be updated.
   * @param {UpdateOwnerDto} dto - Data Transfer Object containing the updated owner details.
   * @returns {Promise<Owner>} - A promise that resolves to the updated owner entity.
   * @throws {EntityNotFoundError} - Throws an error if the account or owner is not found.
   */
  async updateOwner(id: number, dto: UpdateOwnerDto): Promise<Owner> {
    // Fetch the account using the provided account UUID.
    const account: Account = await this.accountRepository.findOneOrFail({
      where: { uuid: dto.account_uuid },
    });

    // Update the owner entity with the provided details.
    await this.ownerRepository.update(id, {
      ...dto,
      account,
      date_updated: new Date(),
    });

    // Fetch and return the updated owner entity.
    return await this.ownerRepository.findOneOrFail({
      where: { id, account_uuid: dto.account_uuid },
    });
  }

  /**
   * Retrieves an owner based on the provided ID and account UUID.
   *
   * This function fetches an owner by its ID and account UUID from the repository.
   *
   * @param {number} id - The ID of the owner to be retrieved.
   * @param {UUID} accountUuid - The UUID of the account associated with the owner.
   * @returns {Promise<Owner>} - A promise that resolves to the retrieved owner.
   * @throws {EntityNotFoundError} - Throws an error if the owner is not found.
   */
  async getOwner(id: number, accountUuid: UUID): Promise<Owner> {
    // Fetch the owner using the provided ID and account UUID.
    const owner: Owner = await this.ownerRepository.findOneOrFail({
      where: { id: id, account_uuid: accountUuid },
    });

    // Return the retrieved owner.
    return owner;
  }

  /**
   * Retrieves the owners of a specified account.
   *
   * This function fetches an account by its UUID and returns its associated owners.
   *
   * @param {UUID} accountUuid - The UUID of the account whose owners are to be retrieved.
   * @returns {Promise<Owner[]>} - A promise that resolves to an array of owners.
   * @throws {EntityNotFoundError} - Throws an error if the account is not found.
   */
  async getAccountOwners(accountUuid: UUID): Promise<Owner[]> {
    // Fetch the account along with its owners using the provided UUID.
    const account: Account = await this.accountRepository.findOneOrFail({
      where: { uuid: accountUuid },
      relations: ['owners'],
    });

    // Extract and return the owners from the account.
    return account.owners;
  }

  /**
   * Deletes an owner based on the provided ID and account UUID.
   *
   * This function finds an owner by its ID and account UUID, then removes it from the repository.
   *
   * @param {number} id - The ID of the owner to be deleted.
   * @param {DeleteOwnerDto} dto - Data Transfer Object containing the account UUID.
   * @returns {Promise<Owner>} - A promise that resolves to the deleted owner.
   * @throws {EntityNotFoundError} - Throws an error if the owner is not found.
   */
  async deleteOwner(id: number, dto: DeleteOwnerDto): Promise<Owner> {
    // Fetch the owner using the provided ID and account UUID.
    const owner: Owner = await this.ownerRepository.findOneOrFail({
      where: { id: id, account_uuid: dto.account_uuid },
    });
    
    // Remove the owner from the repository and return the removed entity.
    return await this.ownerRepository.remove(owner);
  }
}
