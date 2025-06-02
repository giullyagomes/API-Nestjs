import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('products')
export class Product {
  @ApiProperty({ description: 'Unique product identifier' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Product name' })
  @Column()
  name: string;

  @ApiProperty({ description: 'Product description' })
  @Column({ type: 'text' })
  description: string;

  @ApiProperty({ description: 'Product price' })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @ApiProperty({ description: 'Available stock quantity' })
  @Column({ default: 0 })
  stockQuantity: number;

  @ApiProperty({ description: 'Product category' })
  @Column()
  category: string;

  @ApiProperty({ description: 'Product image URL' })
  @Column({ nullable: true })
  imageUrl: string;

  @ApiProperty({ description: 'Is product active' })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({ description: 'Product creation date' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Product last update date' })
  @UpdateDateColumn()
  updatedAt: Date;
}