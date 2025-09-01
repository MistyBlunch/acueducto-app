import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@/test/utils';
import userEvent from '@testing-library/user-event';
import { SearchBar } from '../search-bar';

describe('SearchBar', () => {
  const mockOnSearch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render with placeholder text', () => {
    render(<SearchBar onSearch={mockOnSearch} />);

    expect(
      screen.getByPlaceholderText('Buscar productos...'),
    ).toBeInTheDocument();
  });

  it('should render with custom placeholder', () => {
    render(
      <SearchBar onSearch={mockOnSearch} placeholder="Custom placeholder" />,
    );

    expect(
      screen.getByPlaceholderText('Custom placeholder'),
    ).toBeInTheDocument();
  });

  it('should be disabled when loading', () => {
    render(<SearchBar onSearch={mockOnSearch} isLoading={true} />);

    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });

  it('should call onSearch on form submit', async () => {
    const user = userEvent.setup();

    render(<SearchBar onSearch={mockOnSearch} />);

    const input = screen.getByRole('textbox');

    await user.type(input, 'test query');
    await user.keyboard('{Enter}');

    expect(mockOnSearch).toHaveBeenCalledWith('test query');
  });

  it('should clear input when clear button is clicked', async () => {
    const user = userEvent.setup();

    render(<SearchBar onSearch={mockOnSearch} />);

    const input = screen.getByRole('textbox');

    // Type something
    await user.type(input, 'test');

    // Find and click clear button
    const clearButton = screen.getByRole('button');
    await user.click(clearButton);

    // Input should be cleared
    expect(input).toHaveValue('');
    expect(mockOnSearch).toHaveBeenCalledWith('');
  });
});
