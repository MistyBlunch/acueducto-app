import { ApiProperty } from '@nestjs/swagger';

export class PaginationDto {
  @ApiProperty({
    description: 'Current page number (1-based)',
    example: 1,
    minimum: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
    minimum: 1,
    maximum: 100,
  })
  pageSize: number;

  @ApiProperty({
    description: 'Total number of items found',
    example: 150,
    minimum: 0,
  })
  total: number;

  @ApiProperty({
    description: 'Total number of pages available',
    example: 15,
    minimum: 0,
  })
  totalPages: number;

  @ApiProperty({
    description: 'Whether there is a previous page',
    example: false,
  })
  hasPreviousPage: boolean;

  @ApiProperty({
    description: 'Whether there is a next page',
    example: true,
  })
  hasNextPage: boolean;
}