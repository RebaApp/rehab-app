const request = require('supertest');
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Mock @prisma/client module before importing anything
const mockPrismaClient = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  center: {
    findUnique: jest.fn(),
  },
};

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => mockPrismaClient),
}));

// Import auth routes after mocking
const authRoutes = require('../routes/auth');

// Create test app
const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Auth API Tests', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Set default environment variables
    process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-only';
    process.env.JWT_EXPIRES_IN = '7d';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    const validUserData = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
      userType: 'USER'
    };

    it('should register a new user successfully', async () => {
      // Mock: user doesn't exist
      mockPrismaClient.user.findUnique.mockResolvedValue(null);
      
      // Mock: create user
      const createdUser = {
        id: 'user-123',
        email: validUserData.email,
        name: validUserData.name,
        userType: validUserData.userType,
        phone: null,
        age: null,
        createdAt: new Date()
      };
      mockPrismaClient.user.create.mockResolvedValue(createdUser);

      const response = await request(app)
        .post('/api/auth/register')
        .send(validUserData)
        .expect(201);

      expect(response.body).toHaveProperty('message', 'User created successfully');
      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('token');
      expect(response.body.user.email).toBe(validUserData.email);
      expect(response.body.user.name).toBe(validUserData.name);
      expect(response.body.user).not.toHaveProperty('password');
      
      // Verify Prisma was called correctly
      expect(mockPrismaClient.user.findUnique).toHaveBeenCalledWith({
        where: { email: validUserData.email }
      });
      expect(mockPrismaClient.user.create).toHaveBeenCalled();
    });

    it('should return 400 if user already exists', async () => {
      // Mock: user already exists
      mockPrismaClient.user.findUnique.mockResolvedValue({
        id: 'existing-user',
        email: validUserData.email
      });

      const response = await request(app)
        .post('/api/auth/register')
        .send(validUserData)
        .expect(400);

      expect(response.body).toHaveProperty('error', 'User already exists with this email');
      expect(mockPrismaClient.user.create).not.toHaveBeenCalled();
    });

    it('should return 400 if email is invalid', async () => {
      const invalidData = {
        ...validUserData,
        email: 'invalid-email'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(invalidData)
        .expect(400);

      expect(response.body).toHaveProperty('errors');
      expect(mockPrismaClient.user.findUnique).not.toHaveBeenCalled();
    });

    it('should return 400 if password is too short', async () => {
      const invalidData = {
        ...validUserData,
        password: '12345' // less than 6 characters
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(invalidData)
        .expect(400);

      expect(response.body).toHaveProperty('errors');
    });

    it('should return 400 if name is too short', async () => {
      const invalidData = {
        ...validUserData,
        name: 'A' // less than 2 characters
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(invalidData)
        .expect(400);

      expect(response.body).toHaveProperty('errors');
    });

    it('should return 400 if userType is invalid', async () => {
      const invalidData = {
        ...validUserData,
        userType: 'INVALID_TYPE'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(invalidData)
        .expect(400);

      expect(response.body).toHaveProperty('errors');
    });

    it('should hash password before saving', async () => {
      mockPrismaClient.user.findUnique.mockResolvedValue(null);
      
      const createdUser = {
        id: 'user-123',
        email: validUserData.email,
        name: validUserData.name,
        userType: validUserData.userType,
        phone: null,
        age: null,
        createdAt: new Date()
      };
      mockPrismaClient.user.create.mockResolvedValue(createdUser);

      await request(app)
        .post('/api/auth/register')
        .send(validUserData)
        .expect(201);

      // Verify password was hashed (check that create was called with hashed password)
      const createCall = mockPrismaClient.user.create.mock.calls[0];
      expect(createCall[0].data.password).not.toBe(validUserData.password);
      expect(createCall[0].data.password.length).toBeGreaterThan(20); // bcrypt hash is long
    });

    it('should accept optional fields (phone, age)', async () => {
      mockPrismaClient.user.findUnique.mockResolvedValue(null);
      
      const userWithOptionalFields = {
        ...validUserData,
        phone: '+79991234567',
        age: 25
      };

      const createdUser = {
        id: 'user-123',
        ...userWithOptionalFields,
        createdAt: new Date()
      };
      mockPrismaClient.user.create.mockResolvedValue(createdUser);

      const response = await request(app)
        .post('/api/auth/register')
        .send(userWithOptionalFields)
        .expect(201);

      expect(response.body.user).toHaveProperty('phone', userWithOptionalFields.phone);
      expect(response.body.user).toHaveProperty('age', userWithOptionalFields.age);
    });
  });

  describe('POST /api/auth/login', () => {
    const loginData = {
      email: 'test@example.com',
      password: 'password123'
    };

    const mockUser = {
      id: 'user-123',
      email: loginData.email,
      password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyY5Y5Y5Y5Y5', // hashed password
      name: 'Test User',
      userType: 'USER',
      phone: null,
      age: null,
      createdAt: new Date()
    };

    it('should login user with valid credentials', async () => {
      // Mock: user exists
      mockPrismaClient.user.findUnique.mockResolvedValue(mockUser);
      
      // Mock bcrypt.compare to return true
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Login successful');
      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('token');
      expect(response.body.user.email).toBe(loginData.email);
      expect(response.body.user).not.toHaveProperty('password');
      
      // Verify Prisma was called
      expect(mockPrismaClient.user.findUnique).toHaveBeenCalledWith({
        where: { email: loginData.email }
      });
      
      // Verify bcrypt.compare was called
      expect(bcrypt.compare).toHaveBeenCalledWith(loginData.password, mockUser.password);
    });

    it('should return 401 if user does not exist', async () => {
      // Mock: user doesn't exist
      mockPrismaClient.user.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body).toHaveProperty('error', 'Invalid credentials');
      expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    it('should return 401 if password is incorrect', async () => {
      // Mock: user exists
      mockPrismaClient.user.findUnique.mockResolvedValue(mockUser);
      
      // Mock bcrypt.compare to return false (wrong password)
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          ...loginData,
          password: 'wrongpassword'
        })
        .expect(401);

      expect(response.body).toHaveProperty('error', 'Invalid credentials');
      expect(bcrypt.compare).toHaveBeenCalled();
    });

    it('should return 400 if email is invalid', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'invalid-email',
          password: 'password123'
        })
        .expect(400);

      expect(response.body).toHaveProperty('errors');
      expect(mockPrismaClient.user.findUnique).not.toHaveBeenCalled();
    });

    it('should return 400 if password is missing', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: loginData.email
        })
        .expect(400);

      expect(response.body).toHaveProperty('errors');
    });

    it('should generate valid JWT token', async () => {
      mockPrismaClient.user.findUnique.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      // Verify token is valid JWT
      const token = response.body.token;
      expect(token).toBeDefined();
      
      // Decode and verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      expect(decoded).toHaveProperty('userId', mockUser.id);
      expect(decoded).toHaveProperty('email', mockUser.email);
    });
  });

  describe('GET /api/auth/me', () => {
    const mockUser = {
      id: 'user-123',
      email: 'test@example.com',
      name: 'Test User',
      userType: 'USER',
      phone: null,
      age: null,
      avatar: null,
      createdAt: new Date()
    };

    it('should return user data with valid token', async () => {
      // Create valid token
      const token = jwt.sign(
        { userId: mockUser.id, email: mockUser.email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      // Mock: user exists
      mockPrismaClient.user.findUnique.mockResolvedValue(mockUser);

      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveProperty('user');
      expect(response.body.user.id).toBe(mockUser.id);
      expect(response.body.user.email).toBe(mockUser.email);
      expect(response.body.user).not.toHaveProperty('password');
    });

    it('should return 401 if token is missing', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 401 if token is invalid', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 401 if user not found', async () => {
      // Create valid token
      const token = jwt.sign(
        { userId: 'non-existent-user', email: 'test@example.com' },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      // Mock: user doesn't exist
      mockPrismaClient.user.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('PUT /api/auth/profile', () => {
    const mockUser = {
      id: 'user-123',
      email: 'test@example.com',
      name: 'Test User',
      userType: 'USER',
      phone: null,
      age: null,
      avatar: null,
      createdAt: new Date()
    };

    it('should update user profile with valid data', async () => {
      // Create valid token
      const token = jwt.sign(
        { userId: mockUser.id, email: mockUser.email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      const updatedUser = {
        ...mockUser,
        name: 'Updated Name',
        phone: '+79991234567',
        age: 30,
        updatedAt: new Date()
      };

      // Mock: user exists and update succeeds
      mockPrismaClient.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaClient.user.update.mockResolvedValue(updatedUser);

      const response = await request(app)
        .put('/api/auth/profile')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Updated Name',
          phone: '+79991234567',
          age: 30
        })
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Profile updated successfully');
      expect(response.body.user.name).toBe('Updated Name');
      expect(response.body.user.phone).toBe('+79991234567');
      expect(response.body.user.age).toBe(30);
    });

    it('should return 400 if name is too short', async () => {
      const token = jwt.sign(
        { userId: mockUser.id, email: mockUser.email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      const response = await request(app)
        .put('/api/auth/profile')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'A' // less than 2 characters
        })
        .expect(400);

      expect(response.body).toHaveProperty('errors');
    });

    it('should return 400 if phone is invalid', async () => {
      const token = jwt.sign(
        { userId: mockUser.id, email: mockUser.email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      const response = await request(app)
        .put('/api/auth/profile')
        .set('Authorization', `Bearer ${token}`)
        .send({
          phone: '123' // invalid phone
        })
        .expect(400);

      expect(response.body).toHaveProperty('errors');
    });

    it('should return 400 if age is out of range', async () => {
      const token = jwt.sign(
        { userId: mockUser.id, email: mockUser.email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      const response = await request(app)
        .put('/api/auth/profile')
        .set('Authorization', `Bearer ${token}`)
        .send({
          age: 10 // less than 18
        })
        .expect(400);

      expect(response.body).toHaveProperty('errors');
    });

    it('should return 401 if token is missing', async () => {
      const response = await request(app)
        .put('/api/auth/profile')
        .send({
          name: 'New Name'
        })
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });
});

