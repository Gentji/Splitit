import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  ValidateNested,
  IsNumber,
  IsOptional
} from 'class-validator';
import { Type } from 'class-transformer';
import { SharingMethod } from 'apps/api/src/common/entities/transaction.entity';

export class SharedWithEntry {
  @IsNumber()
  id: number;

  @IsNumber()
  @IsOptional()
  take: number;
}

export class SharingInfo {
  @ApiProperty({
    name: 'method',
    enum: SharingMethod,
    default: 'equally',
    required: true,
    description:
      'Method to share the transaction between owners: equally, shares or amounts',
  })
  @IsEnum(SharingMethod)
  method: SharingMethod;

  @ApiProperty({
    name: 'shared_with',
    description: 'Contains ids of the owners the transaction is shared with.',
  })
  @ValidateNested({ each: true })
  @Type(() => SharedWithEntry)
  shared_with: SharedWithEntry[];
}