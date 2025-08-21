const jwt = require('jsonwebtoken');

// Middleware to verify JWT and check for admin role
const verifyAdmin = (req, res, next) => {
  const token = req.cookies.token; // Assuming token is sent via cookie
  if (!token) {
    return res.redirect('/admin/login'); // Redirect to login if no token
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).send('Access Denied: Not an Admin');
    }
    req.user = decoded;
    next();
  } catch (err) {
    res.clearCookie('token');
    return res.redirect('/admin/login'); // Redirect to login if token is invalid
  }
};

module.exports = { verifyAdmin };