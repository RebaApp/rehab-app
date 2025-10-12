const express = require('express');
const { body, query, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const { authMiddleware, centerOwnerMiddleware } = require('../middleware/auth');

const prisma = new PrismaClient();
const router = express.Router();

// Get all centers with filters
router.get('/', [
  query('city').optional().trim(),
  query('type').optional().trim(),
  query('search').optional().trim(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { city, type, search, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build where clause
    const where = {};
    
    if (city) {
      where.city = { contains: city, mode: 'insensitive' };
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (type) {
      where.types = {
        some: {
          name: { contains: type, mode: 'insensitive' }
        }
      };
    }

    // Get centers with relations
    const centers = await prisma.center.findMany({
      where,
      skip,
      take: parseInt(limit),
      include: {
        photos: true,
        types: true,
        services: true,
        methods: true,
        reviews: {
          select: {
            rating: true
          }
        },
        _count: {
          select: {
            reviews: true
          }
        }
      },
      orderBy: {
        rating: 'desc'
      }
    });

    // Calculate average ratings
    const centersWithRating = centers.map(center => {
      const avgRating = center.reviews.length > 0
        ? center.reviews.reduce((sum, review) => sum + review.rating, 0) / center.reviews.length
        : 0;

      return {
        ...center,
        rating: Math.round(avgRating * 10) / 10,
        reviewsCount: center._count.reviews
      };
    });

    // Get total count for pagination
    const total = await prisma.center.count({ where });

    res.json({
      centers: centersWithRating,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Get centers error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get center by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const center = await prisma.center.findUnique({
      where: { id },
      include: {
        photos: true,
        types: true,
        services: true,
        methods: true,
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        }
      }
    });

    if (!center) {
      return res.status(404).json({ error: 'Center not found' });
    }

    // Calculate average rating
    const avgRating = center.reviews.length > 0
      ? center.reviews.reduce((sum, review) => sum + review.rating, 0) / center.reviews.length
      : 0;

    res.json({
      ...center,
      rating: Math.round(avgRating * 10) / 10
    });

  } catch (error) {
    console.error('Get center error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create center (authenticated users only)
router.post('/', authMiddleware, [
  body('name').trim().isLength({ min: 2 }),
  body('city').trim().isLength({ min: 2 }),
  body('address').optional().trim(),
  body('description').optional().trim(),
  body('phone').optional().isMobilePhone('ru-RU'),
  body('email').optional().isEmail(),
  body('website').optional().isURL(),
  body('workingHours').optional().trim(),
  body('capacity').optional().isInt({ min: 1 }),
  body('yearFounded').optional().isInt({ min: 1900, max: new Date().getFullYear() }),
  body('license').optional().trim(),
  body('price').optional().trim(),
  body('coordinates').optional().isObject(),
  body('types').optional().isArray(),
  body('services').optional().isArray(),
  body('methods').optional().isArray()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name, city, address, description, phone, email, website,
      workingHours, capacity, yearFounded, license, price,
      coordinates, types = [], services = [], methods = []
    } = req.body;

    // Create center
    const center = await prisma.center.create({
      data: {
        name,
        city,
        address,
        description,
        phone,
        email,
        website,
        workingHours,
        capacity: capacity ? parseInt(capacity) : null,
        yearFounded: yearFounded ? parseInt(yearFounded) : null,
        license,
        price,
        coordinates: coordinates ? JSON.stringify(coordinates) : null,
        ownerId: req.user.id,
        types: {
          connect: types.map(typeId => ({ id: typeId }))
        },
        services: {
          connect: services.map(serviceId => ({ id: serviceId }))
        },
        methods: {
          connect: methods.map(methodId => ({ id: methodId }))
        }
      },
      include: {
        types: true,
        services: true,
        methods: true
      }
    });

    res.status(201).json({
      message: 'Center created successfully',
      center
    });

  } catch (error) {
    console.error('Create center error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update center (owner or admin only)
router.put('/:id', authMiddleware, centerOwnerMiddleware, [
  body('name').optional().trim().isLength({ min: 2 }),
  body('city').optional().trim().isLength({ min: 2 }),
  body('address').optional().trim(),
  body('description').optional().trim(),
  body('phone').optional().isMobilePhone('ru-RU'),
  body('email').optional().isEmail(),
  body('website').optional().isURL(),
  body('workingHours').optional().trim(),
  body('capacity').optional().isInt({ min: 1 }),
  body('yearFounded').optional().isInt({ min: 1900, max: new Date().getFullYear() }),
  body('license').optional().trim(),
  body('price').optional().trim(),
  body('coordinates').optional().isObject()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const updateData = {};

    // Build update data
    const allowedFields = [
      'name', 'city', 'address', 'description', 'phone', 'email',
      'website', 'workingHours', 'capacity', 'yearFounded', 'license', 'price'
    ];

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    if (req.body.coordinates) {
      updateData.coordinates = JSON.stringify(req.body.coordinates);
    }

    const center = await prisma.center.update({
      where: { id },
      data: updateData,
      include: {
        types: true,
        services: true,
        methods: true
      }
    });

    res.json({
      message: 'Center updated successfully',
      center
    });

  } catch (error) {
    console.error('Update center error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete center (owner or admin only)
router.delete('/:id', authMiddleware, centerOwnerMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.center.delete({
      where: { id }
    });

    res.json({ message: 'Center deleted successfully' });

  } catch (error) {
    console.error('Delete center error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get center types
router.get('/types/list', async (req, res) => {
  try {
    const types = await prisma.centerType.findMany({
      orderBy: { name: 'asc' }
    });

    res.json({ types });
  } catch (error) {
    console.error('Get center types error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get services
router.get('/services/list', async (req, res) => {
  try {
    const services = await prisma.service.findMany({
      orderBy: { name: 'asc' }
    });

    res.json({ services });
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get methods
router.get('/methods/list', async (req, res) => {
  try {
    const methods = await prisma.method.findMany({
      orderBy: { name: 'asc' }
    });

    res.json({ methods });
  } catch (error) {
    console.error('Get methods error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
