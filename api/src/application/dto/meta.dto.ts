import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class MetaDto {
  @ApiPropertyOptional({
    description: 'Search query used for filtering',
    example: 'nike',
  })
  query?: string;

  @ApiProperty({
    description: 'Whether the search query is a palindrome (eligible for discount)',
    example: false,
  })
  isPalindrome: boolean;

  @ApiProperty({
    description: 'Search execution timestamp',
    example: '2023-12-01T15:30:00.000Z',
    format: 'date-time',
  })
  executedAt: string;

  @ApiProperty({
    description: 'Query execution time in milliseconds',
    example: 25.5,
    minimum: 0,
  })
  executionTimeMs: number;
}