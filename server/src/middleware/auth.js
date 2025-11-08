const jwt = require('jsonwebtoken');
const prisma = require('../utils/prisma');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        userType: true,
        phone: true,
        age: true,
        avatar: true
      }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid token. User not found.' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ error: 'Invalid token.' });
  }
};

const adminMiddleware = (req, res, next) => {
  if (req.user?.userType !== 'ADMIN') {
    return res.status(403).json({ error: 'Access denied. Admin required.' });
  }
  next();
};

const centerOwnerMiddleware = async (req, res, next) => {
  try {
    const centerId = req.params.id || req.body.centerId;
    
    if (!centerId) {
      return res.status(400).json({ error: 'Center ID required.' });
    }

    const center = await prisma.center.findUnique({
      where: { id: centerId },
      select: { ownerId: true }
    });

    if (!center) {
      return res.status(404).json({ error: 'Center not found.' });
    }

    if (center.ownerId !== req.user.id && req.user.userType !== 'ADMIN') {
      return res.status(403).json({ error: 'Access denied. Center owner required.' });
    }

    next();
  } catch (error) {
    console.error('Center owner middleware error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

module.exports = {
  authMiddleware,
  adminMiddleware,
  centerOwnerMiddleware
};
