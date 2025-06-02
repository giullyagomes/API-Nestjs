import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Cart } from './entities/cart.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@ApiTags('cart')
@Controller('cart')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  @ApiOperation({ summary: 'Add a product to cart' })
  @ApiResponse({ status: 201, description: 'Product added to cart successfully.', type: Cart })
  addToCart(
    @Body() addToCartDto: AddToCartDto,
    @CurrentUser() user: User,
  ) {
    return this.cartService.addToCart(user.id, addToCartDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get user cart' })
  @ApiResponse({ status: 200, description: 'Return user cart items.', type: [Cart] })
  getUserCart(@CurrentUser() user: User) {
    return this.cartService.getUserCart(user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update cart item quantity' })
  @ApiResponse({ status: 200, description: 'Cart item updated successfully.', type: Cart })
  @ApiResponse({ status: 404, description: 'Cart item not found.' })
  updateCartItem(
    @Param('id') id: string,
    @Body() updateCartDto: UpdateCartDto,
    @CurrentUser() user: User,
  ) {
    return this.cartService.updateCartItem(id, user.id, updateCartDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove item from cart' })
  @ApiResponse({ status: 200, description: 'Item removed from cart successfully.' })
  @ApiResponse({ status: 404, description: 'Cart item not found.' })
  removeFromCart(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ) {
    return this.cartService.removeFromCart(id, user.id);
  }

  @Delete()
  @ApiOperation({ summary: 'Clear user cart' })
  @ApiResponse({ status: 200, description: 'Cart cleared successfully.' })
  clearCart(@CurrentUser() user: User) {
    return this.cartService.clearCart(user.id);
  }
}