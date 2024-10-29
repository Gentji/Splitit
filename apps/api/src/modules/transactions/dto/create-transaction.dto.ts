import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsInt,
  IsEnum,
  ValidateNested,
  IsUUID,
  Validate,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CurrencyCode } from '../../../common/entities/currency.enum';
import { SharedInfoValidator } from '../../../common/validators/shared-info.validator';
import { TransactionType } from 'apps/api/src/common/entities/transaction.entity';
import { SharingInfo } from './common.dto';
import { UUID } from 'crypto';

export class CreateTransactionDto {
  @ApiProperty({
    name: 'account_uuid',
    description: 'UUID of the associated account.',
    required: true,
    type: String,
    format: 'uuid',
  })
  @IsNotEmpty()
  @IsUUID()
  account_uuid: UUID;

  @ApiProperty({
    name: 'sharing_info',
    type: 'json',
    description: 'Details about how the transaction is shared.',
    required: true,
  })
  @ValidateNested()
  @Type(() => SharingInfo)
  @Validate(SharedInfoValidator)
  sharing_info: SharingInfo;

  @ApiProperty({
    enum: TransactionType,
    default: TransactionType.EXPENSE,
    description: 'Type of the transaction: expense, income or transfer.',
    required: true,
    type: String,
  })
  @IsEnum(TransactionType)
  type: TransactionType;

  @ApiProperty({
    enum: CurrencyCode,
    description: 'Currency of the transaction.',
    required: true,
    type: String,
  })
  @IsEnum(CurrencyCode)
  currency: CurrencyCode;

  @ApiProperty({
    type: "double precision",
    description: 'Amount of the transaction.',
    required: true,
  })
  @IsNotEmpty()
  @IsInt()
  amount: number;

  @ApiProperty({
    type: String,
    description: 'Name of the transaction.',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  name: string;
}
