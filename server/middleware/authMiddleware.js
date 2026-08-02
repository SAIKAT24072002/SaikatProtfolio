import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  // Retrieve token from HttpOnly cookies
  if (req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    res.status(401);
    return next(new Error('Not authorized. No credentials provided.'));
  }

  try {
    // Decode and verify token integrity
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find matching admin identity excluding password hash
    req.user = await User.findById(decoded.id).select('-password');
    
    if (!req.user) {
      res.status(401);
      return next(new Error('Not authorized. User profile does not exist.'));
    }

    next();
  } catch (err) {
    res.status(401);
    return next(new Error('Not authorized. Credentials session expired.'));
  }
};
