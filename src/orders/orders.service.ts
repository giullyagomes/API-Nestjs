import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { CartService } from '../cart/cart.service';
import { ProductsService } from '../products/products.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,
    private cartService: CartService,
    private productsService: ProductsService,
    private dataSource: DataSource,
  ) {}

  async create(userId: string, createOrderDto: CreateOrderDto): Promise<Order> {
    // Get user cart
    const cartItems = await this.cartService.getUserCart(userId);
    
    if (cartItems.length === 0) {
      throw new Error('Cannot create order with empty cart');
    }
    
    // Start transaction
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      // Create order
      const order = new Order();
      order.userId = userId;
      order.shippingAddress = createOrderDto.shippingAddress;
      order.status = OrderStatus.PENDING;
      order.totalAmount = 0;
      
      const savedOrder = await queryRunner.manager.save(order);
      
      // Create order items and update product stock
      const orderItems: OrderItem[] = [];
      
      for (const cartItem of cartItems) {
        const product = await this.productsService.findOne(cartItem.productId);
        
        // Check if product is in stock
        if (product.stockQuantity < cartItem.quantity) {
          throw new Error(`Not enough stock for product "${product.name}"`);
        }
        
        // Update product stock
        product.stockQuantity -= cartItem.quantity;
        await queryRunner.manager.save(product);
        
        // Create order item
        const orderItem = new OrderItem();
        orderItem.orderId = savedOrder.id;
        orderItem.productId = product.id;
        orderItem.productName = product.name;
        orderItem.price = product.price;
        orderItem.quantity = cartItem.quantity;
        orderItem.subtotal = product.price * cartItem.quantity;
        
        orderItems.push(orderItem);
        
        // Update order total
        savedOrder.totalAmount += orderItem.subtotal;
      }
      
      // Save order items
      await queryRunner.manager.save(OrderItem, orderItems);
      
      // Update order total
      await queryRunner.manager.save(savedOrder);
      
      // Clear cart
      await this.cartService.clearCart(userId);
      
      // Commit transaction
      await queryRunner.commitTransaction();
      
      return this.findOne(savedOrder.id, userId);
    } catch (error) {
      // Rollback transaction on error
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Release query runner
      await queryRunner.release();
    }
  }

  async findAll(userId: string): Promise<Order[]> {
    return this.ordersRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, userId: string): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { id, userId },
      relations: ['items', 'items.product'],
    });
    
    if (!order) {
      throw new NotFoundException(`Order with ID "${id}" not found`);
    }
    
    return order;
  }

  async updateStatus(id: string, updateOrderStatusDto: UpdateOrderStatusDto): Promise<Order> {
    const order = await this.ordersRepository.findOneBy({ id });
    
    if (!order) {
      throw new NotFoundException(`Order with ID "${id}" not found`);
    }
    
    order.status = updateOrderStatusDto.status;
    
    return this.ordersRepository.save(order);
  }

  async findAllOrders(): Promise<Order[]> {
    return this.ordersRepository.find({
      order: { createdAt: 'DESC' },
    });
  }
}