import { Injectable } from '@nestjs/common'
import { PrismaService } from '../database/prisma.service'
import { ProductWriter, CreateProductData, UpdateProductData } from '../../core/interfaces/product-writer.interface'
import { Product } from '../../core/entities/product.entity'

@Injectable()
export class PrismaProductWriter implements ProductWriter {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateProductData): Promise<Product> {
    const product = await this.prisma.product.create({
      data: {
        title: data.title,
        brand: data.brand,
        description: data.description,
        priceCents: data.priceCents,
        currency: data.currency,
        stock: data.stock,
      },
    })

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

  async update(id: string, data: UpdateProductData): Promise<Product> {
    const product = await this.prisma.product.update({
      where: { id },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.brand && { brand: data.brand }),
        ...(data.description && { description: data.description }),
        ...(data.priceCents !== undefined && { priceCents: data.priceCents }),
        ...(data.currency && { currency: data.currency }),
        ...(data.stock !== undefined && { stock: data.stock }),
      },
    })

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

  async delete(id: string): Promise<void> {
    await this.prisma.product.delete({
      where: { id },
    })
  }
}