const { auth } = require('../config/firebase');

/**
 * Middleware to verify Firebase ID token
 * Extracts token from Authorization header and verifies it
 */
const verifyFirebaseToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'No authentication token provided'
      });
    }

    // Verify the token
    const decodedToken = await auth.verifyIdToken(token);
    
    // Attach user info to request
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name || decodedToken.email?.split('@')[0]
    };
    
    next();
  } catch (error) {
    console.error('Token verification error:', error.message);
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired authentication token'
    });
  }
};

/**
 * Optional auth middleware - doesn't fail if no token, just sets req.user to null
 */
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];
    
    if (token) {
      const decodedToken = await auth.verifyIdToken(token);
      req.user = {
        uid: decodedToken.uid,
        email: decodedToken.email,
        name: decodedToken.name || decodedToken.email?.split('@')[0]
      };
    } else {
      req.user = null;
    }
    
    next();
  } catch (error) {
    // Silently fail - allow request to continue
    req.user = null;
    next();
  }
};

module.exports = {
  verifyFirebaseToken,
  optionalAuth
};
