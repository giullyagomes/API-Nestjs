import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Order } from './order.entity';
import { Product } from '../../products/entities/product.entity';

@Entity('order_items')
export class OrderItem {
  @ApiProperty({ description: 'Unique order item identifier' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Order this item belongs to' })
  @ManyToOne(() => Order, order => order.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @Column()
  orderId: string;

  @ApiProperty({ description: 'Product in this order item' })
  @ManyToOne(() => Product)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column()
  productId: string;

  @ApiProperty({ description: 'Product name (snapshot at time of order)' })
  @Column()
  productName: string;

  @ApiProperty({ description: 'Product price (snapshot at time of order)' })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @ApiProperty({ description: 'Quantity ordered' })
  @Column()
  quantity: number;

  @ApiProperty({ description: 'Subtotal for this item' })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;
}