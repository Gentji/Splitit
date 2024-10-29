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
import { Type, Expose, Transform } from 'class-transformer';
import { CurrencyCode } from '../../../common/entities/currency.enum';
import { SharedInfoValidator } from '../../../common/validators/shared-info.validator';
import { UUID } from 'crypto';
// import { SharingInfo } from './common.dto';

export class UpdateOwnerDto {
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

  @IsString()
  @IsNotEmpty()
  name?: string;
}
