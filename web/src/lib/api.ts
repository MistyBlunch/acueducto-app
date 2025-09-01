import {
  ProductsResponseSchema,
  type SearchParams,
  ApiErrorSchema,
  ApiException,
} from '@/types/api';

const API_BASE_URL =
  process.env['NEXT_PUBLIC_API_BASE_URL'] || 'http://localhost:3001';

export class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      // Handle non-JSON responses (like server errors)
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        if (!response.ok) {
          throw new ApiException(
            response.status,
            `Server error: ${response.statusText}`,
            undefined,
            undefined,
          );
        }
      }

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const parsedError = ApiErrorSchema.safeParse(data);
        if (parsedError.success) {
          throw ApiException.fromResponse(parsedError.data);
        }

        // Handle specific status codes
        let errorMessage = 'Unknown error occurred';
        switch (response.status) {
          case 404:
            errorMessage =
              'Servicio no encontrado. Verifica que la API esté ejecutándose.';
            break;
          case 500:
            errorMessage = 'Error interno del servidor';
            break;
          case 502:
          case 503:
          case 504:
            errorMessage =
              'Servidor no disponible. Intenta nuevamente en unos momentos.';
            break;
          default:
            errorMessage = data.message || data.error || errorMessage;
        }

        throw new ApiException(response.status, errorMessage, data);
      }

      return data;
    } catch (error) {
      if (error instanceof ApiException) {
        throw error;
      }

      // Handle network errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new ApiException(
          0,
          'Error de conexión. Verifica que la API esté ejecutándose en http://localhost:3001',
          error,
        );
      }

      throw new ApiException(
        500,
        error instanceof Error ? error.message : 'Error desconocido',
      );
    }
  }

  async searchProducts(params: SearchParams) {
    const searchParams = new URLSearchParams();

    if (params.query) {
      searchParams.append('query', params.query);
    }
    searchParams.append('page', params.page.toString());
    searchParams.append('pageSize', params.pageSize.toString());

    const endpoint = `/products?${searchParams.toString()}`;
    const response = await this.request(endpoint);

    return ProductsResponseSchema.parse(response);
  }

  async getAllProducts(page: number = 1, pageSize: number = 12) {
    const searchParams = new URLSearchParams();
    searchParams.append('page', page.toString());
    searchParams.append('pageSize', pageSize.toString());

    const endpoint = `/products?${searchParams.toString()}`;
    const response = await this.request(endpoint);

    return ProductsResponseSchema.parse(response);
  }
}

export const apiClient = new ApiClient();
