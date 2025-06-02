import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Role } from '../enums/role.enum';
import { Cart } from '../../cart/entities/cart.entity';
import { Order } from '../../orders/entities/order.entity';

@Entity('users')
export class User {
  @ApiProperty({ description: 'Unique user identifier' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'User email' })
  @Column({ unique: true })
  email: string;

  @ApiProperty({ description: 'User full name' })
  @Column()
  fullName: string;

  @ApiProperty({ description: 'User password', writeOnly: true })
  @Column()
  @Exclude()
  password: string;

  @ApiProperty({ description: 'User role', enum: Role, default: Role.USER })
  @Column({ type: 'simple-enum', enum: Role, default: Role.USER })
  role: Role;

  @ApiProperty({ description: 'User cart', type: () => Cart })
  @OneToMany(() => Cart, cart => cart.user)
  cart: Cart[];

  @ApiProperty({ description: 'User orders', type: () => Order })
  @OneToMany(() => Order, order => order.user)
  orders: Order[];

  @ApiProperty({ description: 'User creation date' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'User last update date' })
  @UpdateDateColumn()
  updatedAt: Date;
}