const jwt = require('jsonwebtoken');
require("dotenv").config(); // Load env variables
const JWT_SECRET = process.env.JWT_SECRET; // Make sure this secret is the same during token generation

const fetchuser = (req, res, next) => {
    const token = req.header('authToken');
    
    if (!token) {
        return res.status(401).send({ error: 'Token not provided. Please authenticate.' });
    }

    try {
        const data = jwt.verify(token, JWT_SECRET); // Verifying the token
        req.user = data.user; // Extracting user data from token
        next(); 
    } catch (error) {
        return res.status(401).send({ error: 'Invalid token. Please authenticate.' });
    }
};

module.exports = fetchuser;
