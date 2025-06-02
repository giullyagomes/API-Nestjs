import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Like, FindOptionsWhere } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FindProductsDto } from './dto/find-products.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productsRepository.create(createProductDto);
    return this.productsRepository.save(product);
  }

  async findAll(findProductsDto: FindProductsDto): Promise<{ items: Product[]; total: number }> {
    const { page, limit, name, category, minPrice, maxPrice } = findProductsDto;
    
    const where: FindOptionsWhere<Product> = {};
    
    if (name) {
      where.name = Like(`%${name}%`);
    }
    
    if (category) {
      where.category = category;
    }
    
    if (minPrice !== undefined && maxPrice !== undefined) {
      where.price = Between(minPrice, maxPrice);
    } else if (minPrice !== undefined) {
      where.price = Between(minPrice, Number.MAX_SAFE_INTEGER);
    } else if (maxPrice !== undefined) {
      where.price = Between(0, maxPrice);
    }
    
    const [items, total] = await this.productsRepository.findAndCount({
      where,
      skip: page * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    
    return { items, total };
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productsRepository.findOneBy({ id });
    
    if (!product) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }
    
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);
    
    Object.assign(product, updateProductDto);
    
    return this.productsRepository.save(product);
  }

  async remove(id: string): Promise<void> {
    const product = await this.findOne(id);
    
    await this.productsRepository.remove(product);
  }
  
  async updateStock(id: string, quantity: number): Promise<Product> {
    const product = await this.findOne(id);
    
    if (product.stockQuantity < quantity) {
      throw new Error(`Not enough stock for product "${product.name}"`);
    }
    
    product.stockQuantity -= quantity;
    
    return this.productsRepository.save(product);
  }
}