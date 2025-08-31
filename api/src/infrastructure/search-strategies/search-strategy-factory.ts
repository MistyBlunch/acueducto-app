import { Injectable } from '@nestjs/common'
import { SearchStrategy, SearchStrategyFactory } from '../../core/interfaces/search-strategy.interface'
import { SearchQuery } from '../../core/value-objects/search-query.vo'
import { ExactMatchSearchStrategy } from './exact-match-strategy'

@Injectable()
export class SearchStrategyFactoryImpl implements SearchStrategyFactory {
  constructor(
    private readonly exactMatchStrategy: ExactMatchSearchStrategy
  ) {}

  getStrategy(query: SearchQuery): SearchStrategy {
    // For now, we only have one strategy, but this allows for easy extension
    if (this.exactMatchStrategy.canHandle(query)) {
      return this.exactMatchStrategy
    }
    
    throw new Error(`No search strategy available for query: ${query.getValue()}`)
  }
}