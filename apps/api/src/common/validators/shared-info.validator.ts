import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Account } from '../entities/account.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { UUID } from 'crypto';

@ValidatorConstraint({ name: 'ValidateSharedInfo', async: true })
@Injectable()
export class SharedInfoValidator implements ValidatorConstraintInterface {
  private failedValidationMessage: string;

  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>
  ) {}

  /**
   * Main validation method.
   */
  async validate(value: any, args: ValidationArguments): Promise<boolean> {
    const { account_uuid, sharing_info, amount } = args.object as any;
    // Ensure required fields are present
    if (!account_uuid) {
      this.failedValidationMessage =
        'Account_uuid field is missing.';
      return false;
    }
    if (!sharing_info?.shared_with) {
      this.failedValidationMessage =
        'Shared_with field is missing.';
      return false;
    }

    const sharedWith = sharing_info.shared_with;

    // Handle array case
    if (Array.isArray(sharedWith)) {
      // Validate shared_with entries based on the method
      if (!this.validateSharedWithEntries(sharing_info.method, sharedWith)) {
        return false;
      }
      const sharedWithIds = sharedWith.map((entry) => entry.id);
      const ownershipIsValid = await this.validateOwnership(
        account_uuid,
        sharedWithIds
      );

      if (!ownershipIsValid) {
        return false;
      }

      // Additional validation for 'amounts' method
      if (sharing_info.method === 'amounts') {
        const sharedWithAmounts = sharedWith.map((entry) => entry.take);
        return this.validateAmounts(sharedWithAmounts, amount);
      }

      return true;
    }

    this.failedValidationMessage = 'Invalid shared_with format.';
    return false;
  }

  /**
   * Validates that the sum of amounts in sharedWithAmounts equals totalAmount.
   */
  private validateAmounts(
    sharedWithAmounts: number[],
    totalAmount: number
  ): boolean {
    const totalSharedAmount = sharedWithAmounts.reduce(
      (total, amount) => total + amount,
      0
    );
    const isValid = totalSharedAmount === totalAmount;

    if (!isValid) {
      this.failedValidationMessage =
        'Sum of amounts must be equal to total amount.';
    }

    return isValid;
  }

  /**
   * Validates that all IDs in sharedWithIds are unique and belong to the account owners.
   */
  private async validateOwnership(
    accountUuid: UUID,
    sharedWithIds: number[]
  ): Promise<boolean> {
    const account = await this.accountRepository.findOne({
      where: { uuid: accountUuid },
      relations: ['owners'],
    });

    if (!account) {
      this.failedValidationMessage = 'Account not found.';
      return false;
    }

    // Ensure IDs are unique
    const uniqueIds = new Set(sharedWithIds);
    if (uniqueIds.size !== sharedWithIds.length) {
      this.failedValidationMessage = 'The shared_with IDs must be unique.';
      return false;
    }

    // Validate that IDs belong to account owners
    const ownerIds = account.owners.map((owner) => owner.id);
    const allIdsValid = sharedWithIds.every((id) => ownerIds.includes(id));

    if (!allIdsValid) {
      this.failedValidationMessage =
        'Some shared_with IDs are not associated with the specified account.';
      return false;
    }

    return true;
  }

  /**
   * Validates shared_with entries based on the method.
   */
  private validateSharedWithEntries(
    method: 'equally' | 'shares' | 'amounts',
    sharedWith: any[]
  ): boolean {
    if (method === 'equally') {
      const isValid = sharedWith.every((entry) => entry.take === undefined);
      if (!isValid) {
        this.failedValidationMessage =
          'When method is "equally", "take" must not be provided in shared_with entries.';
      }
      return isValid;
    } else {
      const isValid = sharedWith.every((entry) => entry.take !== undefined);
      if (!isValid) {
        this.failedValidationMessage =
          'When method is not "equally", "take" must be provided in shared_with entries.';
      }
      return isValid;
    }
  }

  /**
   * Returns the appropriate validation error message.
   */
  defaultMessage(args: ValidationArguments): string {
    return this.failedValidationMessage || 'Validation failed for shared_info.';
  }
}
