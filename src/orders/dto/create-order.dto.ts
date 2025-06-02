import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({ description: 'Shipping address', example: '123 Main St, Anytown, AT 12345' })
  @IsNotEmpty()
  @IsString()
  shippingAddress: string;
}