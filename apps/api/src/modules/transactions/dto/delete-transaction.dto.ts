import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { UUID } from 'crypto';

export class DeleteTransactionDto {
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
    name: 'id',
    description: 'Id of the transaction to delete.',
    required: true,
    type: Number,
    format: 'id',
  })
  @IsNotEmpty()
  id: number;
}
