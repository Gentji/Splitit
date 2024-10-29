import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class DeleteOwnerDto {
  @ApiProperty({
    name: 'account_uuid',
    description: 'UUID of the associated account.',
    required: true,
    type: String,
    format: 'uuid',
  })
  @IsNotEmpty()
  @IsUUID()
  account_uuid: string;

  @ApiProperty({
    name: 'id',
    description: 'Id of the owner to delete.',
    required: true,
    type: Number,
    format: 'id',
  })
  @IsNotEmpty()
  id: number;
}
