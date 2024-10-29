import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsEnum,
  ValidateNested,
  Validate,
  IsNumber,
  IsUUID,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { SharedInfoValidator } from '../../../common/validators/shared-info.validator';
import { SharingInfo } from './common.dto';
import { UUID } from 'crypto';

export class UpdateTransactionDto {
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
  sharing_info?: SharingInfo;

  @IsOptional()
  @IsNumber()
  currency_id?: number;

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  amount?: number;

  @IsString()
  @IsNotEmpty()
  name?: string;
}
