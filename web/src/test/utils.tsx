import { type ReactElement } from 'react';
import {
  render,
  type RenderOptions,
  renderHook,
  type RenderHookOptions,
} from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Custom render function that includes providers
function customRender(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  function AllTheProviders({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  }

  return render(ui, { wrapper: AllTheProviders, ...options });
}

// Custom renderHook function that includes providers
function customRenderHook<TResult, TProps>(
  hook: (props: TProps) => TResult,
  options?: Omit<RenderHookOptions<TProps>, 'wrapper'>,
) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  function AllTheProviders({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  }

  return renderHook(hook, { wrapper: AllTheProviders, ...options });
}

// Re-export everything from React Testing Library
export * from '@testing-library/react';
export { customRender as render, customRenderHook as renderHook };
