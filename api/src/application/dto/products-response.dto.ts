import { ProductView } from './product-view.dto';
import { PaginationDto } from './pagination.dto';
import { MetaDto } from './meta.dto';

export class ProductsResponseDto {
  items: ProductView[];
  pagination: PaginationDto;
  meta: MetaDto;
}
