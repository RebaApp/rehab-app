import { renderHook, act } from '@testing-library/react-native';
import useFavorites from '../../hooks/useFavorites';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn()
}));

describe('useFavorites', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes with empty favorites', () => {
    AsyncStorage.getItem.mockResolvedValue(null);
    
    const { result } = renderHook(() => useFavorites());
    
    expect(result.current.favorites).toEqual({});
    expect(result.current.loading).toBe(true);
  });

  it('loads favorites from storage on mount', async () => {
    const mockFavorites = { '1': true, '2': true };
    AsyncStorage.getItem.mockResolvedValue(JSON.stringify(mockFavorites));
    
    const { result } = renderHook(() => useFavorites());
    
    // Wait for async operation
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    expect(result.current.favorites).toEqual(mockFavorites);
    expect(result.current.loading).toBe(false);
  });

  it('toggles favorite correctly', async () => {
    AsyncStorage.getItem.mockResolvedValue(null);
    AsyncStorage.setItem.mockResolvedValue();
    
    const { result } = renderHook(() => useFavorites());
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    // Toggle favorite
    await act(async () => {
      result.current.toggleFavorite('1');
    });
    
    expect(result.current.favorites).toEqual({ '1': true });
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      'reba:favorites_v1',
      JSON.stringify({ '1': true })
    );
  });

  it('removes favorite when toggling existing one', async () => {
    const mockFavorites = { '1': true, '2': true };
    AsyncStorage.getItem.mockResolvedValue(JSON.stringify(mockFavorites));
    AsyncStorage.setItem.mockResolvedValue();
    
    const { result } = renderHook(() => useFavorites());
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    // Toggle existing favorite
    await act(async () => {
      result.current.toggleFavorite('1');
    });
    
    expect(result.current.favorites).toEqual({ '2': true });
  });

  it('checks if item is favorite correctly', async () => {
    const mockFavorites = { '1': true, '2': true };
    AsyncStorage.getItem.mockResolvedValue(JSON.stringify(mockFavorites));
    
    const { result } = renderHook(() => useFavorites());
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    expect(result.current.isFavorite('1')).toBe(true);
    expect(result.current.isFavorite('2')).toBe(true);
    expect(result.current.isFavorite('3')).toBe(false);
  });

  it('clears all favorites', async () => {
    const mockFavorites = { '1': true, '2': true };
    AsyncStorage.getItem.mockResolvedValue(JSON.stringify(mockFavorites));
    AsyncStorage.removeItem.mockResolvedValue();
    
    const { result } = renderHook(() => useFavorites());
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    await act(async () => {
      result.current.clearFavorites();
    });
    
    expect(result.current.favorites).toEqual({});
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith('reba:favorites_v1');
  });

  it('handles storage errors gracefully', async () => {
    AsyncStorage.getItem.mockRejectedValue(new Error('Storage error'));
    
    const { result } = renderHook(() => useFavorites());
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    expect(result.current.favorites).toEqual({});
    expect(result.current.loading).toBe(false);
  });
});
