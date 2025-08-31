import { Injectable } from '@nestjs/common'
import { PrismaService } from '../database/prisma.service'
import { ProductReader } from '../../core/interfaces/product-reader.interface'
import { Product } from '../../core/entities/product.entity'
import { SearchQuery } from '../../core/value-objects/search-query.vo'
import { PaginationParams } from '../../core/value-objects/pagination-params.vo'

@Injectable()
export class PrismaProductReader implements ProductReader {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Product | null> {
    const product = await this.prisma.product.findUnique({
      where: { id },
    })

    if (!product) {
      return null
    }

    return Product.create({
      id: product.id,
      title: product.title,
      brand: product.brand,
      description: product.description,
      priceCents: product.priceCents,
      currency: product.currency,
      stock: product.stock,
      createdAt: product.createdAt,
    })
  }

  async searchProducts(query: SearchQuery, pagination: PaginationParams): Promise<Product[]> {
    const { page, pageSize } = pagination
    const skip = (page - 1) * pageSize
    const take = pageSize
    
    let whereClause = {}
    
    if (!query.isEmpty()) {
      whereClause = {
        OR: [
          {
            title: {
              contains: query.getValue(),
              mode: 'insensitive',
            },
          },
          {
            brand: {
              contains: query.getValue(),
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: query.getValue(),
              mode: 'insensitive',
            },
          },
        ],
      }
    }

    const products = await this.prisma.product.findMany({
      where: whereClause,
      orderBy: [
        { createdAt: 'desc' },
      ],
      skip,
      take,
    })

    return products.map(product =>
      Product.create({
        id: product.id,
        title: product.title,
        brand: product.brand,
        description: product.description,
        priceCents: product.priceCents,
        currency: product.currency,
        stock: product.stock,
        createdAt: product.createdAt,
      })
    )
  }

  async countSearchResults(query: SearchQuery): Promise<number> {
    let whereClause = {}
    
    if (!query.isEmpty()) {
      whereClause = {
        OR: [
          {
            title: {
              contains: query.getValue(),
              mode: 'insensitive',
            },
          },
          {
            brand: {
              contains: query.getValue(),
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: query.getValue(),
              mode: 'insensitive',
            },
          },
        ],
      }
    }

    return this.prisma.product.count({
      where: whereClause,
    })
  }
}