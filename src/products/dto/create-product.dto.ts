import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, IsUrl, Min } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ description: 'Product name', example: 'Wireless Headphones' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Product description', example: 'High quality wireless headphones with noise cancellation' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ description: 'Product price', example: 99.99 })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty({ description: 'Product stock quantity', example: 100 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  stockQuantity: number;

  @ApiProperty({ description: 'Product category', example: 'Electronics' })
  @IsNotEmpty()
  @IsString()
  category: string;

  @ApiProperty({ description: 'Product image URL', required: false, example: 'https://example.com/headphones.jpg' })
  @IsOptional()
  @IsUrl()
  imageUrl?: string;
}