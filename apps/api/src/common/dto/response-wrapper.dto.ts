import { ApiProperty } from '@nestjs/swagger';

export class ResponseWrapper<T> {
  @ApiProperty({ description: 'Status of the response', example: 'success' })
  status: string;

  @ApiProperty({ description: 'Response message', example: 'Operation completed successfully.' })
  message: string;

  @ApiProperty({ description: 'Response data', type: Object, nullable: true })
  data: T;

  constructor(status: string, message: string, data: T) {
    this.status = status;
    this.message = message;
    this.data = data;
  }
}
