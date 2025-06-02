import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { forwardRef } from '@nestjs/common';
import { User } from '../../users/entities/user.entity';
import { Product } from '../../products/entities/product.entity';

@Entity('cart_items')
export class Cart {
  @ApiProperty({ description: 'Unique cart item identifier' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'User who owns this cart item' })
  @ManyToOne(() => forwardRef(() => User), user => user.cart, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @ApiProperty({ description: 'Product in the cart' })
  @ManyToOne(() => Product, { eager: true })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column()
  productId: string;

  @ApiProperty({ description: 'Quantity of the product' })
  @Column({ default: 1 })
  quantity: number;

  @ApiProperty({ description: 'Cart item creation date' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Cart item last update date' })
  @UpdateDateColumn()
  updatedAt: Date;
}