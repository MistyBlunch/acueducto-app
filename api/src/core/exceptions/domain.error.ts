export abstract class DomainError extends Error {
  abstract readonly code: string;
  abstract readonly statusCode: number;

  constructor(
    message: string,
    public readonly context?: Record<string, unknown>,
  ) {
    super(message);
    this.name = this.constructor.name;
    
    // Maintains proper stack trace for where error was thrown
    Error.captureStackTrace?.(this, this.constructor);
  }

  public toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      statusCode: this.statusCode,
      ...(this.context && { context: this.context }),
    };
  }
}

// Product Domain Errors
export class ProductNotFoundError extends DomainError {
  readonly code = 'PRODUCT_NOT_FOUND';
  readonly statusCode = 404;

  constructor(productId: string) {
    super(`Product with ID '${productId}' was not found`, { productId });
  }
}

export class InvalidSearchQueryError extends DomainError {
  readonly code = 'INVALID_SEARCH_QUERY';
  readonly statusCode = 400;

  constructor(query: string, reason?: string) {
    super(
      `Invalid search query: '${query}'${reason ? ` - ${reason}` : ''}`,
      { query, reason },
    );
  }
}

export class ProductValidationError extends DomainError {
  readonly code = 'PRODUCT_VALIDATION_ERROR';
  readonly statusCode = 422;

  constructor(field: string, value: unknown, constraint: string) {
    super(`Product validation failed for field '${field}': ${constraint}`, {
      field,
      value,
      constraint,
    });
  }
}

// Generic Business Rule Errors
export class BusinessRuleViolationError extends DomainError {
  readonly code = 'BUSINESS_RULE_VIOLATION';
  readonly statusCode = 409;

  constructor(rule: string, details?: string) {
    super(`Business rule violation: ${rule}${details ? ` - ${details}` : ''}`, {
      rule,
      details,
    });
  }
}

// Repository/Infrastructure Errors
export class RepositoryError extends DomainError {
  readonly code = 'REPOSITORY_ERROR';
  readonly statusCode = 500;

  constructor(operation: string, details?: string) {
    super(`Repository operation failed: ${operation}${details ? ` - ${details}` : ''}`, {
      operation,
      details,
    });
  }
}

export class DatabaseConnectionError extends DomainError {
  readonly code = 'DATABASE_CONNECTION_ERROR';
  readonly statusCode = 503;

  constructor(details?: string) {
    super(`Database connection failed${details ? `: ${details}` : ''}`, {
      details,
    });
  }
}

// Configuration/Environment Errors
export class ConfigurationError extends DomainError {
  readonly code = 'CONFIGURATION_ERROR';
  readonly statusCode = 500;

  constructor(setting: string, reason?: string) {
    super(
      `Configuration error for '${setting}'${reason ? `: ${reason}` : ''}`,
      { setting, reason },
    );
  }
}