import apiService from '../../services/apiService';

// Mock fetch
global.fetch = jest.fn();

describe('ApiService', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  describe('GET requests', () => {
    it('makes successful GET request', async () => {
      const mockData = { id: 1, name: 'Test' };
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData
      });

      const result = await apiService.get('/test');

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockData);
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/test',
        expect.objectContaining({
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })
      );
    });

    it('handles GET request errors', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await apiService.get('/test');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Network error');
    });

    it('handles HTTP error responses', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found'
      });

      const result = await apiService.get('/test');

      expect(result.success).toBe(false);
      expect(result.error).toContain('404');
    });
  });

  describe('POST requests', () => {
    it('makes successful POST request', async () => {
      const mockData = { id: 1, name: 'Test' };
      const requestData = { name: 'Test' };
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData
      });

      const result = await apiService.post('/test', requestData);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockData);
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/test',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(requestData),
          headers: {
            'Content-Type': 'application/json'
          }
        })
      );
    });
  });

  describe('Centers API', () => {
    it('gets centers with filters', async () => {
      const mockCenters = [{ id: 1, name: 'Center 1' }];
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCenters
      });

      const result = await apiService.getCenters({ city: 'Moscow' });

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockCenters);
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/centers?city=Moscow',
        expect.any(Object)
      );
    });

    it('gets single center', async () => {
      const mockCenter = { id: 1, name: 'Center 1' };
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCenter
      });

      const result = await apiService.getCenter('1');

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockCenter);
    });
  });

  describe('Auth API', () => {
    it('logs in successfully', async () => {
      const mockUser = { id: 1, email: 'test@test.com' };
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockUser
      });

      const result = await apiService.login('test@test.com', 'password');

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockUser);
    });

    it('registers successfully', async () => {
      const mockUser = { id: 1, email: 'test@test.com' };
      const userData = { email: 'test@test.com', password: 'password' };
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockUser
      });

      const result = await apiService.register(userData);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockUser);
    });
  });

  describe('Cache functionality', () => {
    it('caches GET requests', async () => {
      const mockData = { id: 1, name: 'Test' };
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData
      });

      // First request
      const result1 = await apiService.get('/test');
      expect(result1.success).toBe(true);
      expect(fetch).toHaveBeenCalledTimes(1);

      // Second request should use cache
      const result2 = await apiService.get('/test');
      expect(result2.success).toBe(true);
      expect(result2.fromCache).toBe(true);
      expect(fetch).toHaveBeenCalledTimes(1);
    });

    it('clears cache on POST requests', async () => {
      const mockData = { id: 1, name: 'Test' };
      fetch.mockResolvedValue({
        ok: true,
        json: async () => mockData
      });

      // GET request to populate cache
      await apiService.get('/centers');
      
      // POST request should clear cache
      await apiService.createCenter({ name: 'New Center' });
      
      // Next GET request should not use cache
      await apiService.get('/centers');
      expect(fetch).toHaveBeenCalledTimes(3);
    });
  });
});
