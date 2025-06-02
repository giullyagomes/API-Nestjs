import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartService } from '../src/cart/cart.service';
import { Cart } from '../src/cart/entities/cart.entity';
import { ProductsService } from '../src/products/products.service';
import { NotFoundException } from '@nestjs/common';

const mockCartRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn(),
});

const mockProductsService = () => ({
  findOne: jest.fn(),
});

describe('CartService', () => {
  let service: CartService;
  let repository: Repository<Cart>;
  let productsService: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        {
          provide: getRepositoryToken(Cart),
          useFactory: mockCartRepository,
        },
        {
          provide: ProductsService,
          useFactory: mockProductsService,
        },
      ],
    }).compile();

    service = module.get<CartService>(CartService);
    repository = module.get<Repository<Cart>>(getRepositoryToken(Cart));
    productsService = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addToCart', () => {
    it('should add a new product to cart', async () => {
      const userId = 'user-id';
      const addToCartDto = {
        productId: 'product-id',
        quantity: 2,
      };

      const product = {
        id: 'product-id',
        name: 'Test Product',
        price: 99.99,
        stockQuantity: 10,
      };

      const cartItem = {
        id: 'cart-item-id',
        userId,
        productId: addToCartDto.productId,
        quantity: addToCartDto.quantity,
      };

      jest.spyOn(productsService, 'findOne').mockResolvedValue(product as any);
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      jest.spyOn(repository, 'create').mockReturnValue(cartItem as any);
      jest.spyOn(repository, 'save').mockResolvedValue(cartItem as any);

      const result = await service.addToCart(userId, addToCartDto);
      
      expect(result).toEqual(cartItem);
      expect(productsService.findOne).toHaveBeenCalledWith(addToCartDto.productId);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { userId, productId: addToCartDto.productId },
      });
      expect(repository.create).toHaveBeenCalledWith({
        userId,
        productId: addToCartDto.productId,
        quantity: addToCartDto.quantity,
      });
      expect(repository.save).toHaveBeenCalledWith(cartItem);
    });

    it('should update quantity if product already in cart', async () => {
      const userId = 'user-id';
      const addToCartDto = {
        productId: 'product-id',
        quantity: 2,
      };

      const product = {
        id: 'product-id',
        name: 'Test Product',
        price: 99.99,
        stockQuantity: 10,
      };

      const existingCartItem = {
        id: 'cart-item-id',
        userId,
        productId: addToCartDto.productId,
        quantity: 1,
      };

      const updatedCartItem = {
        ...existingCartItem,
        quantity: existingCartItem.quantity + addToCartDto.quantity,
      };

      jest.spyOn(productsService, 'findOne').mockResolvedValue(product as any);
      jest.spyOn(repository, 'findOne').mockResolvedValue(existingCartItem as any);
      jest.spyOn(repository, 'save').mockResolvedValue(updatedCartItem as any);

      const result = await service.addToCart(userId, addToCartDto);
      
      expect(result).toEqual(updatedCartItem);
      expect(repository.save).toHaveBeenCalledWith({
        ...existingCartItem,
        quantity: existingCartItem.quantity + addToCartDto.quantity,
      });
    });

    it('should throw error if not enough stock', async () => {
      const userId = 'user-id';
      const addToCartDto = {
        productId: 'product-id',
        quantity: 20,
      };

      const product = {
        id: 'product-id',
        name: 'Test Product',
        price: 99.99,
        stockQuantity: 10,
      };

      jest.spyOn(productsService, 'findOne').mockResolvedValue(product as any);

      await expect(service.addToCart(userId, addToCartDto)).rejects.toThrow(
        'Not enough stock for product "Test Product"',
      );
    });
  });

  describe('getUserCart', () => {
    it('should return user cart items', async () => {
      const userId = 'user-id';
      const cartItems = [
        {
          id: 'cart-item-id-1',
          userId,
          productId: 'product-id-1',
          quantity: 2,
          product: {
            id: 'product-id-1',
            name: 'Test Product 1',
            price: 99.99,
          },
        },
        {
          id: 'cart-item-id-2',
          userId,
          productId: 'product-id-2',
          quantity: 1,
          product: {
            id: 'product-id-2',
            name: 'Test Product 2',
            price: 199.99,
          },
        },
      ];

      jest.spyOn(repository, 'find').mockResolvedValue(cartItems as any);

      const result = await service.getUserCart(userId);
      
      expect(result).toEqual(cartItems);
      expect(repository.find).toHaveBeenCalledWith({
        where: { userId },
        relations: ['product'],
      });
    });
  });

  describe('findOne', () => {
    it('should return a cart item', async () => {
      const userId = 'user-id';
      const cartItemId = 'cart-item-id';
      const cartItem = {
        id: cartItemId,
        userId,
        productId: 'product-id',
        quantity: 2,
        product: {
          id: 'product-id',
          name: 'Test Product',
          price: 99.99,
        },
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(cartItem as any);

      const result = await service.findOne(cartItemId, userId);
      
      expect(result).toEqual(cartItem);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: cartItemId, userId },
        relations: ['product'],
      });
    });

    it('should throw NotFoundException if cart item not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne('cart-item-id', 'user-id')).rejects.toThrow(NotFoundException);
    });
  });
});