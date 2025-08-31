import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@/test/utils'
import userEvent from '@testing-library/user-event'
import { SearchBar } from '../search-bar'

describe('SearchBar', () => {
  const mockOnSearch = vi.fn()
  
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render with placeholder text', () => {
    render(<SearchBar onSearch={mockOnSearch} />)
    
    expect(screen.getByPlaceholderText('Buscar productos...')).toBeInTheDocument()
  })

  it('should render with custom placeholder', () => {
    render(<SearchBar onSearch={mockOnSearch} placeholder="Custom placeholder" />)
    
    expect(screen.getByPlaceholderText('Custom placeholder')).toBeInTheDocument()
  })

  it('should call onSearch when typing with debounce', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    vi.useFakeTimers()
    
    render(<SearchBar onSearch={mockOnSearch} />)
    
    const input = screen.getByRole('textbox')
    
    // Type a search query
    await user.type(input, 'producto')
    
    // Should not be called immediately
    expect(mockOnSearch).not.toHaveBeenCalled()
    
    // Advance timers by debounce delay (300ms)
    vi.advanceTimersByTime(300)
    
    // Should be called now
    expect(mockOnSearch).toHaveBeenCalledWith('producto')
    
    vi.useRealTimers()
  })

  it('should debounce multiple rapid keystrokes', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    vi.useFakeTimers()
    
    render(<SearchBar onSearch={mockOnSearch} />)
    
    const input = screen.getByRole('textbox')
    
    // Type multiple characters rapidly
    await user.type(input, 'r')
    vi.advanceTimersByTime(100)
    await user.type(input, 'a')
    vi.advanceTimersByTime(100)
    await user.type(input, 'q')
    vi.advanceTimersByTime(100)
    
    // Should not be called yet
    expect(mockOnSearch).not.toHaveBeenCalled()
    
    // Advance to complete the debounce delay
    vi.advanceTimersByTime(300)
    
    // Should be called only once with the final value
    expect(mockOnSearch).toHaveBeenCalledTimes(1)
    expect(mockOnSearch).toHaveBeenCalledWith('raq')
    
    vi.useRealTimers()
  })

  it('should show palindrome hint for palindromic queries', async () => {
    const user = userEvent.setup()
    
    render(<SearchBar onSearch={mockOnSearch} />)
    
    const input = screen.getByRole('textbox')
    
    // Type a palindromic word
    await user.type(input, 'oso')
    
    // Should show palindrome hint
    await waitFor(() => {
      expect(screen.getByText(/palíndromo detectado/i)).toBeInTheDocument()
    })
  })

  it('should not show palindrome hint for non-palindromic queries', async () => {
    const user = userEvent.setup()
    
    render(<SearchBar onSearch={mockOnSearch} />)
    
    const input = screen.getByRole('textbox')
    
    // Type a non-palindromic word
    await user.type(input, 'producto')
    
    // Should not show palindrome hint
    expect(screen.queryByText(/palíndromo detectado/i)).not.toBeInTheDocument()
  })

  it('should not show palindrome hint for short queries', async () => {
    const user = userEvent.setup()
    
    render(<SearchBar onSearch={mockOnSearch} />)
    
    const input = screen.getByRole('textbox')
    
    // Type a short palindromic word (less than 3 characters)
    await user.type(input, 'aa')
    
    // Should not show palindrome hint for short queries
    expect(screen.queryByText(/palíndromo detectado/i)).not.toBeInTheDocument()
  })

  it('should show and hide clear button based on input', async () => {
    const user = userEvent.setup()
    
    render(<SearchBar onSearch={mockOnSearch} />)
    
    const input = screen.getByRole('textbox')
    
    // Initially no clear button
    expect(screen.queryByRole('button', { name: /clear/i })).not.toBeInTheDocument()
    
    // Type something
    await user.type(input, 'test')
    
    // Clear button should appear
    const clearButton = screen.getByRole('button')
    expect(clearButton).toBeInTheDocument()
    
    // Click clear button
    await user.click(clearButton)
    
    // Input should be cleared
    expect(input).toHaveValue('')
    expect(mockOnSearch).toHaveBeenCalledWith('')
  })

  it('should handle form submission', async () => {
    const user = userEvent.setup()
    
    render(<SearchBar onSearch={mockOnSearch} />)
    
    const input = screen.getByRole('textbox')
    
    // Type a search query
    await user.type(input, 'producto')
    
    // Submit the form
    await user.keyboard('{Enter}')
    
    // Should call onSearch immediately (not debounced)
    expect(mockOnSearch).toHaveBeenCalledWith('producto')
  })

  it('should be disabled when loading', () => {
    render(<SearchBar onSearch={mockOnSearch} isLoading={true} />)
    
    const input = screen.getByRole('textbox')
    expect(input).toBeDisabled()
  })

  it('should handle special characters and spaces', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    vi.useFakeTimers()
    
    render(<SearchBar onSearch={mockOnSearch} />)
    
    const input = screen.getByRole('textbox')
    
    // Type query with special characters and spaces
    await user.type(input, 'producto premium 2024!')
    
    vi.advanceTimersByTime(300)
    
    expect(mockOnSearch).toHaveBeenCalledWith('producto premium 2024!')
    
    vi.useRealTimers()
  })
})