/**
 * @fileoverview This file contains the middleware function for JWT authentication.
 * The middleware function `authenticateJWT` verifies the JWT token sent in the request headers.
 * If the token is valid, the user information is attached to the request object.
 * If the token is invalid or not provided, appropriate HTTP status codes are returned.
 * 
 * @namespace middleware
 * @memberof module:api-gateway
 */

const jwt = require('jsonwebtoken');

/**
 * Middleware function to authenticate JWT tokens.
 * 
 * This function checks the `Authorization` header for a JWT token, verifies the token using a secret key,
 * and if valid, attaches the user information to the request object. If the token is invalid or missing,
 * it responds with the appropriate HTTP status code (401 or 403).
 * 
 * @function
 * @memberof module:api-gateway/middleware
 * @param {Object} req - The request object, which includes headers and user information if authenticated.
 * @param {Object} res - The response object, used to send the HTTP response.
 * @param {Function} next - The next middleware function in the stack to be called after this middleware.
 * @returns {void}
 */
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403); // Forbidden
            }

            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401); // Unauthorized
    }
};

module.exports = authenticateJWT;

