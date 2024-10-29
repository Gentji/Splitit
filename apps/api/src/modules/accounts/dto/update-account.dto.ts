import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class UpdateAccountDto {
  @ApiProperty({
    description: 'The name of the account to update.',
    type: String,
    example: 'Chrismas party 2024',
  })
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  name?: string;

  @IsOptional()
  @IsNumber()
  default_currency_id?: number;
}
