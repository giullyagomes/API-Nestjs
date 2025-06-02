import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductsService } from '../src/products/products.service';
import { Product } from '../src/products/entities/product.entity';
import { NotFoundException } from '@nestjs/common';
import { CreateProductDto } from '../src/products/dto/create-product.dto';
import { UpdateProductDto } from '../src/products/dto/update-product.dto';

const mockProductRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  findOneBy: jest.fn(),
  findAndCount: jest.fn(),
  remove: jest.fn(),
});

describe('ProductsService', () => {
  let service: ProductsService;
  let repository: Repository<Product>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useFactory: mockProductRepository,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    repository = module.get<Repository<Product>>(getRepositoryToken(Product));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a product', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Test Product',
        description: 'Test Description',
        price: 99.99,
        stockQuantity: 100,
        category: 'Test Category',
      };

      const product = {
        id: 'test-id',
        ...createProductDto,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(repository, 'create').mockReturnValue(product as any);
      jest.spyOn(repository, 'save').mockResolvedValue(product as any);

      const result = await service.create(createProductDto);
      expect(result).toEqual(product);
      expect(repository.create).toHaveBeenCalledWith(createProductDto);
      expect(repository.save).toHaveBeenCalledWith(product);
    });
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const products = [
        {
          id: 'test-id-1',
          name: 'Test Product 1',
          description: 'Test Description 1',
          price: 99.99,
          stockQuantity: 100,
          category: 'Test Category',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'test-id-2',
          name: 'Test Product 2',
          description: 'Test Description 2',
          price: 199.99,
          stockQuantity: 50,
          category: 'Test Category',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      jest.spyOn(repository, 'findAndCount').mockResolvedValue([products, products.length]);

      const result = await service.findAll({});
      expect(result).toEqual({ items: products, total: products.length });
      expect(repository.findAndCount).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a product', async () => {
      const product = {
        id: 'test-id',
        name: 'Test Product',
        description: 'Test Description',
        price: 99.99,
        stockQuantity: 100,
        category: 'Test Category',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(repository, 'findOneBy').mockResolvedValue(product as any);

      const result = await service.findOne('test-id');
      expect(result).toEqual(product);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 'test-id' });
    });

    it('should throw NotFoundException if product not found', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

      await expect(service.findOne('test-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const updateProductDto: UpdateProductDto = {
        name: 'Updated Product',
        price: 199.99,
      };

      const existingProduct = {
        id: 'test-id',
        name: 'Test Product',
        description: 'Test Description',
        price: 99.99,
        stockQuantity: 100,
        category: 'Test Category',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedProduct = {
        ...existingProduct,
        ...updateProductDto,
      };

      jest.spyOn(repository, 'findOneBy').mockResolvedValue(existingProduct as any);
      jest.spyOn(repository, 'save').mockResolvedValue(updatedProduct as any);

      const result = await service.update('test-id', updateProductDto);
      expect(result).toEqual(updatedProduct);
      expect(repository.save).toHaveBeenCalledWith({
        ...existingProduct,
        ...updateProductDto,
      });
    });
  });

  describe('remove', () => {
    it('should remove a product', async () => {
      const product = {
        id: 'test-id',
        name: 'Test Product',
      };

      jest.spyOn(repository, 'findOneBy').mockResolvedValue(product as any);
      jest.spyOn(repository, 'remove').mockResolvedValue(undefined);

      await service.remove('test-id');
      expect(repository.remove).toHaveBeenCalledWith(product);
    });
  });

  describe('updateStock', () => {
    it('should update product stock', async () => {
      const product = {
        id: 'test-id',
        name: 'Test Product',
        stockQuantity: 100,
      };

      const updatedProduct = {
        ...product,
        stockQuantity: 90,
      };

      jest.spyOn(repository, 'findOneBy').mockResolvedValue(product as any);
      jest.spyOn(repository, 'save').mockResolvedValue(updatedProduct as any);

      const result = await service.updateStock('test-id', 10);
      expect(result).toEqual(updatedProduct);
      expect(repository.save).toHaveBeenCalledWith({
        ...product,
        stockQuantity: 90,
      });
    });

    it('should throw error if not enough stock', async () => {
      const product = {
        id: 'test-id',
        name: 'Test Product',
        stockQuantity: 5,
      };

      jest.spyOn(repository, 'findOneBy').mockResolvedValue(product as any);

      await expect(service.updateStock('test-id', 10)).rejects.toThrow(
        'Not enough stock for product "Test Product"',
      );
    });
  });
});