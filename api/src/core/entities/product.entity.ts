export interface ProductProps {
  id: string;
  title: string;
  brand: string;
  description: string;
  priceCents: number;
  currency: string;
  stock: number;
  createdAt: Date;
  updatedAt?: Date;
}

export class Product {
  private constructor(private readonly props: ProductProps) {}

  public static create(props: ProductProps): Product {
    return new Product(props);
  }

  public get id(): string {
    return this.props.id;
  }

  public get title(): string {
    return this.props.title;
  }

  public get brand(): string {
    return this.props.brand;
  }

  public get description(): string {
    return this.props.description;
  }

  public get priceCents(): number {
    return this.props.priceCents;
  }

  public get currency(): string {
    return this.props.currency;
  }

  public get stock(): number {
    return this.props.stock;
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  public get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }
  public isInStock(): boolean {
    return this.props.stock > 0;
  }

  public applyDiscount(discountPercentage: number): number {
    return Math.round(this.props.priceCents * (1 - discountPercentage / 100));
  }

  public toPlainObject(): ProductProps {
    return { ...this.props };
  }
}