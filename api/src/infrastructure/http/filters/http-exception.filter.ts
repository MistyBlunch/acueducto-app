import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ZodError } from 'zod';
import { DomainError } from '../../../core/exceptions/domain.error';

export interface ErrorResponse {
  statusCode: number;
  message: string;
  error: string;
  timestamp: string;
  path: string;
  requestId?: string;
  details?: unknown;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const errorResponse = this.buildErrorResponse(exception, request);
    
    // Log error with appropriate level
    this.logError(exception, errorResponse, request);

    response.status(errorResponse.statusCode).json(errorResponse);
  }

  private buildErrorResponse(exception: unknown, request: Request): ErrorResponse {
    const timestamp = new Date().toISOString();
    const path = request.url;
    const requestId = request.headers['x-request-id'] as string;

    // Handle Domain Errors (Business Logic)
    if (exception instanceof DomainError) {
      return {
        statusCode: exception.statusCode,
        message: exception.message,
        error: exception.code,
        timestamp,
        path,
        requestId,
        details: exception.context,
      };
    }

    // Handle Zod Validation Errors
    if (exception instanceof ZodError) {
      const validationErrors = exception.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
        code: err.code,
      }));

      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Validation failed',
        error: 'VALIDATION_ERROR',
        timestamp,
        path,
        requestId,
        details: { validationErrors },
      };
    }

    // Handle NestJS HTTP Exceptions
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      const message = typeof exceptionResponse === 'string' 
        ? exceptionResponse 
        : (exceptionResponse as any)?.message || exception.message;

      const error = typeof exceptionResponse === 'object' && exceptionResponse !== null
        ? (exceptionResponse as any)?.error || exception.name
        : exception.name;

      return {
        statusCode: status,
        message: Array.isArray(message) ? message.join(', ') : message,
        error,
        timestamp,
        path,
        requestId,
      };
    }

    // Handle Database/Prisma Errors
    if (this.isDatabaseError(exception)) {
      return this.handleDatabaseError(exception as any, timestamp, path, requestId);
    }

    // Handle Generic Errors
    const error = exception as Error;
    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
      error: 'INTERNAL_SERVER_ERROR',
      timestamp,
      path,
      requestId,
      details: process.env.NODE_ENV === 'development' ? {
        originalMessage: error.message,
        stack: error.stack,
      } : undefined,
    };
  }

  private isDatabaseError(exception: unknown): boolean {
    return exception instanceof Error && (
      exception.name.includes('Prisma') ||
      exception.message.includes('database') ||
      exception.message.includes('connection')
    );
  }

  private handleDatabaseError(
    error: Error, 
    timestamp: string, 
    path: string, 
    requestId?: string
  ): ErrorResponse {
    // Map common database errors to appropriate HTTP status codes
    if (error.message.includes('Unique constraint')) {
      return {
        statusCode: HttpStatus.CONFLICT,
        message: 'Resource already exists',
        error: 'RESOURCE_CONFLICT',
        timestamp,
        path,
        requestId,
      };
    }

    if (error.message.includes('Foreign key constraint')) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Invalid reference to related resource',
        error: 'FOREIGN_KEY_VIOLATION',
        timestamp,
        path,
        requestId,
      };
    }

    if (error.message.includes('Connection')) {
      return {
        statusCode: HttpStatus.SERVICE_UNAVAILABLE,
        message: 'Database service temporarily unavailable',
        error: 'DATABASE_UNAVAILABLE',
        timestamp,
        path,
        requestId,
      };
    }

    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Database operation failed',
      error: 'DATABASE_ERROR',
      timestamp,
      path,
      requestId,
    };
  }

  private logError(exception: unknown, errorResponse: ErrorResponse, request: Request): void {
    const { method, url, headers } = request;
    const userAgent = headers['user-agent'] || '';
    const logContext = {
      statusCode: errorResponse.statusCode,
      method,
      url,
      userAgent,
      requestId: errorResponse.requestId,
    };

    if (errorResponse.statusCode >= 500) {
      // Internal server errors
      this.logger.error(
        `${errorResponse.error}: ${errorResponse.message}`,
        exception instanceof Error ? exception.stack : undefined,
        JSON.stringify(logContext),
      );
    } else if (errorResponse.statusCode >= 400) {
      // Client errors
      this.logger.warn(
        `${errorResponse.error}: ${errorResponse.message}`,
        JSON.stringify(logContext),
      );
    } else {
      // Other errors (shouldn't happen, but just in case)
      this.logger.log(
        `${errorResponse.error}: ${errorResponse.message}`,
        JSON.stringify(logContext),
      );
    }
  }
}