import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID, IsNumber, IsOptional } from 'class-validator';
import { UUID } from 'crypto';

export class DeleteAccountDto {
  @ApiProperty({
    name: 'uuid',
    description: 'UUID of the account to be deleted.',
    required: true,
    type: String,
    format: 'uuid',
  })
  @IsNotEmpty()
  @IsUUID()
  uuid: UUID;
}
