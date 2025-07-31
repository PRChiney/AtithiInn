import jwt from 'jsonwebtoken';
import Token from '../models/Token.js';
import Admin from '../models/Admin.js';


export const verifyToken = async (req, res, next) => {
  const token =
    req.cookies?.token ||
    (req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.split(' ')[1]
      : null) ||
    req.query.token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required. Please login.',
      code: 'NO_TOKEN_PROVIDED'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log('Decoded:', decoded);
    console.log('Token in DB:', await Token.findOne({ token, userId: decoded.id }));
 
    if (decoded.isAdmin) {
      const admin = await Admin.findById(decoded.id);
      if (!admin) {
        return res.status(401).json({
          success: false,
          message: 'Admin not found',
          code: 'ADMIN_NOT_FOUND'
        });
      }
      req.user = {
        id: decoded.id,
        isAdmin: true,
        email: admin.email
      };
      return next();
    }



    const tokenExists = await Token.findOne({
      token,
      userId: decoded.id,
      expiresAt: { $gt: new Date() }
    });

    if (!tokenExists) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token. Please login again.',
        code: 'INVALID_TOKEN'
      });
    }

    req.user = {
      id: decoded.id,
      isAdmin: decoded.isAdmin || false,
      emailVerified: decoded.emailVerified || false
    };

    next();
  } catch (error) {
    console.error('Token Verification Error:', error);

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Session expired. Please login again.',
        code: 'TOKEN_EXPIRED'
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid authentication token.',
        code: 'INVALID_TOKEN_FORMAT'
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Authentication failed. Please login again.',
      code: 'AUTHENTICATION_FAILED'
    });
  }
};


export const verifyAdmin = (req, res, next) => {
  if (!req.user?.isAdmin) {
    return res.status(403).json({
      success: false,
      message: 'Unauthorized. Admin privileges required.',
      code: 'ADMIN_ACCESS_REQUIRED'
    });
  }
  next();
};
