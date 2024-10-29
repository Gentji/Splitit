import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUUID } from "class-validator";
import { Account } from "../../../common/entities/account.entity";
import { UUID } from "crypto";

export class CreateOwnerDto {
  @ApiProperty({
    description: "The name of the owner to create.",
    type: String,
    example: 'Benjamin',
  })
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiProperty({
    description: "Uuid of the account the owner belongs to.",
    type: String,
    example: 'b9a72687-5ae9-4ce4-b7c1-c5d99f92f09c',
  })
  @IsString()
  @IsUUID()
  account_uuid!: UUID;
}
