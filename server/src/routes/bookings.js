const express = require('express');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const { authMiddleware, centerOwnerMiddleware } = require('../middleware/auth');

const prisma = new PrismaClient();
const router = express.Router();

// Create booking
router.post('/', authMiddleware, [
  body('centerId').isUUID(),
  body('date').isISO8601(),
  body('time').optional().isString(),
  body('notes').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { centerId, date, time, notes } = req.body;

    // Check if center exists
    const center = await prisma.center.findUnique({
      where: { id: centerId },
      select: { id: true, name: true }
    });

    if (!center) {
      return res.status(404).json({ error: 'Center not found' });
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        centerId,
        userId: req.user.id,
        date: new Date(date).toISOString().split('T')[0],
        time: time || null,
        notes: notes || null,
        status: 'PENDING'
      },
      include: {
        center: {
          select: {
            id: true,
            name: true,
            city: true,
            address: true,
            phone: true
          }
        }
      }
    });

    res.status(201).json({
      message: 'Booking created successfully',
      booking
    });

  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user's bookings
router.get('/my', authMiddleware, async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: { userId: req.user.id },
      include: {
        center: {
          select: {
            id: true,
            name: true,
            city: true,
            address: true,
            phone: true,
            photos: {
              take: 1,
              select: {
                url: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({ bookings });
  } catch (error) {
    console.error('Get user bookings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get center's bookings (for center owners)
router.get('/center/:centerId', authMiddleware, centerOwnerMiddleware, async (req, res) => {
  try {
    const { centerId } = req.params;

    const bookings = await prisma.booking.findMany({
      where: { centerId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({ bookings });
  } catch (error) {
    console.error('Get center bookings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update booking status (center owners only)
router.put('/:id/status', authMiddleware, [
  body('status').isIn(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { status } = req.body;

    // Check if user owns the center
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        center: {
          select: { ownerId: true }
        }
      }
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.center.ownerId !== req.user.id && req.user.userType !== 'ADMIN') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: { status },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        center: {
          select: {
            id: true,
            name: true,
            city: true
          }
        }
      }
    });

    res.json({
      message: 'Booking status updated successfully',
      booking: updatedBooking
    });

  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Cancel booking (user only)
router.put('/:id/cancel', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await prisma.booking.findUnique({
      where: { id },
      select: { userId: true, status: true }
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.userId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (booking.status === 'CANCELLED') {
      return res.status(400).json({ error: 'Booking already cancelled' });
    }

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: { status: 'CANCELLED' },
      include: {
        center: {
          select: {
            id: true,
            name: true,
            city: true
          }
        }
      }
    });

    res.json({
      message: 'Booking cancelled successfully',
      booking: updatedBooking
    });

  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
