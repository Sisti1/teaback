const jwt = require('jsonwebtoken');

const JWT_SECRET_KEY = 'Keshav-is-my-love';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

// Function to generate JWT token
exports.generateToken = (user) => {
    return jwt.sign({ userId: user._id }, JWT_SECRET_KEY, { expiresIn: '1h' });
};

// Middleware to authenticate token
exports.authenticateToken = (req, res, next) => {
    const token = req.header("Authorization").replace("Bearer ", "");
    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET_KEY);
        req.userId = decoded.userId;
        next();
    } catch (err) {
        res.status(400).json({ message: "Invalid token." });
    }
};
