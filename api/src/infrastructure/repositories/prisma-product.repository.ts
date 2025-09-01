import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import {
  ProductRepository,
  PaginationParams,
  PaginatedResult,
  SearchFilters,
} from '../../core/repositories/product.repository';
import { Product } from '../../core/entities/product.entity';
import { PrismaService } from '../database/prisma.service';
import {
  RepositoryError,
  DatabaseConnectionError,
  InvalidSearchQueryError,
} from '../../core/exceptions/domain.error';

@Injectable()
export class PrismaProductRepository implements ProductRepository {
  private readonly logger = new Logger(PrismaProductRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Product | null> {
    try {
      const product = await this.prisma.product.findUnique({
        where: { id },
      });

      return product ? this.toDomain(product) : null;
    } catch (error) {
      this.logger.error(`Failed to find product by ID: ${id}`, error);
      throw this.handlePrismaError(error, 'findById');
    }
  }

  async findByExactTitle(title: string): Promise<Product | null> {
    const product = await this.prisma.product.findFirst({
      where: {
        title: {
          mode: 'insensitive',
          equals: title,
        },
      },
    });

    return product ? this.toDomain(product) : null;
  }

  async searchProducts(
    filters: SearchFilters,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<Product>> {
    const { query } = filters;
    const { page, pageSize } = pagination;
    const offset = (page - 1) * pageSize;

    let whereClause: Prisma.ProductWhereInput = {};

    if (query && query.trim().length >= 4) {
      // Search in brand or description using ILIKE pattern
      whereClause = {
        OR: [
          {
            brand: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: query,
              mode: 'insensitive',
            },
          },
        ],
      };
    }

    // Build dynamic ordering based on search relevance
    const orderBy: Prisma.ProductOrderByWithRelationInput[] = [];
    
    if (query && query.trim().length >= 4) {
      // Order by relevance: brand matches first, then description matches
      // Note: Prisma doesn't support complex relevance scoring, so we use basic ordering
      // For advanced relevance, consider using raw SQL or search engines like Elasticsearch
      orderBy.push(
        { brand: { sort: 'asc', nulls: 'last' } as any }, // Brand matches prioritized
        { createdAt: 'desc' }
      );
    } else {
      // Default ordering for non-search queries
      orderBy.push({ createdAt: 'desc' });
    }

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where: whereClause,
        skip: offset,
        take: pageSize,
        orderBy: { createdAt: 'desc' }, // Simplified for now - TODO: implement proper relevance scoring
      }),
      this.prisma.product.count({
        where: whereClause,
      }),
    ]);

    return {
      data: products.map(this.toDomain),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async create(product: Product): Promise<Product> {
    const props = product.toPlainObject();
    const created = await this.prisma.product.create({
      data: {
        id: props.id,
        title: props.title,
        brand: props.brand,
        description: props.description,
        priceCents: props.priceCents,
        currency: props.currency,
        stock: props.stock,
      },
    });

    return this.toDomain(created);
  }

  async update(id: string, productData: Partial<Product>): Promise<Product> {
    try {
      const updateData: any = {};
      
      if (productData.title) updateData.title = productData.title;
      if (productData.brand) updateData.brand = productData.brand;
      if (productData.description) updateData.description = productData.description;
      if (productData.priceCents !== undefined) updateData.priceCents = productData.priceCents;
      if (productData.currency) updateData.currency = productData.currency;
      if (productData.stock !== undefined) updateData.stock = productData.stock;

      const updated = await this.prisma.product.update({
        where: { id },
        data: updateData,
      });

      return this.toDomain(updated);
    } catch (error) {
      this.logger.error(`Failed to update product with ID: ${id}`, error);
      throw this.handlePrismaError(error, 'update');
    }
  }

  async delete(id: string): Promise<void> {
    await this.prisma.product.delete({
      where: { id },
    });
  }

  private toDomain(prismaProduct: any): Product {
    return Product.create({
      id: prismaProduct.id,
      title: prismaProduct.title,
      brand: prismaProduct.brand,
      description: prismaProduct.description,
      priceCents: prismaProduct.priceCents,
      currency: prismaProduct.currency,
      stock: prismaProduct.stock,
      createdAt: prismaProduct.createdAt,
      updatedAt: prismaProduct.updatedAt,
    });
  }

  private handlePrismaError(error: unknown, operation: string): Error {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002':
          throw new RepositoryError(operation, 'Unique constraint violation');
        case 'P2025':
          throw new RepositoryError(operation, 'Record not found');
        case 'P2003':
          throw new RepositoryError(operation, 'Foreign key constraint violation');
        default:
          throw new RepositoryError(operation, `Database error: ${error.message}`);
      }
    }

    if (error instanceof Prisma.PrismaClientUnknownRequestError) {
      throw new RepositoryError(operation, 'Unknown database error');
    }

    if (error instanceof Prisma.PrismaClientRustPanicError) {
      throw new DatabaseConnectionError('Database engine panic');
    }

    if (error instanceof Prisma.PrismaClientInitializationError) {
      throw new DatabaseConnectionError('Failed to initialize database connection');
    }

    if (error instanceof Prisma.PrismaClientValidationError) {
      throw new InvalidSearchQueryError('', 'Invalid query parameters');
    }

    // Generic error
    throw new RepositoryError(operation, error instanceof Error ? error.message : 'Unknown error');
  }
}