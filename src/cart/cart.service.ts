import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { ProductsService } from '../products/products.service';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    private productsService: ProductsService,
  ) {}

  async addToCart(userId: string, addToCartDto: AddToCartDto): Promise<Cart> {
    const { productId, quantity } = addToCartDto;
    
    // Check if product exists
    const product = await this.productsService.findOne(productId);
    
    // Check if product is in stock
    if (product.stockQuantity < quantity) {
      throw new Error(`Not enough stock for product "${product.name}"`);
    }
    
    // Check if product is already in cart
    let cartItem = await this.cartRepository.findOne({
      where: { userId, productId },
    });
    
    if (cartItem) {
      // Update quantity if product is already in cart
      cartItem.quantity += quantity;
      return this.cartRepository.save(cartItem);
    }
    
    // Add new product to cart
    cartItem = this.cartRepository.create({
      userId,
      productId,
      quantity,
    });
    
    return this.cartRepository.save(cartItem);
  }

  async getUserCart(userId: string): Promise<Cart[]> {
    return this.cartRepository.find({
      where: { userId },
      relations: ['product'],
    });
  }

  async findOne(id: string, userId: string): Promise<Cart> {
    const cartItem = await this.cartRepository.findOne({
      where: { id, userId },
      relations: ['product'],
    });
    
    if (!cartItem) {
      throw new NotFoundException(`Cart item with ID "${id}" not found`);
    }
    
    return cartItem;
  }

  async updateCartItem(id: string, userId: string, updateCartDto: UpdateCartDto): Promise<Cart> {
    const cartItem = await this.findOne(id, userId);
    
    // Check if product is in stock
    const product = await this.productsService.findOne(cartItem.productId);
    
    if (product.stockQuantity < updateCartDto.quantity) {
      throw new Error(`Not enough stock for product "${product.name}"`);
    }
    
    cartItem.quantity = updateCartDto.quantity;
    
    return this.cartRepository.save(cartItem);
  }

  async removeFromCart(id: string, userId: string): Promise<void> {
    const cartItem = await this.findOne(id, userId);
    
    await this.cartRepository.remove(cartItem);
  }

  async clearCart(userId: string): Promise<void> {
    const cartItems = await this.getUserCart(userId);
    
    await this.cartRepository.remove(cartItems);
  }
}