import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsEnum } from "class-validator";
import { CurrencyCode } from '../../../common/entities/currency.enum';

export class CreateAccountDto {
  @ApiProperty({
    description: "The name of the account to create.",
    type: String,
    example: 'Chrismas party 2024',
  })
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiProperty({
    enum: CurrencyCode,
    description: 'Currency of the account.',
    required: true,
    type: String,
  })
  @IsEnum(CurrencyCode)
  default_currency: CurrencyCode;
}
