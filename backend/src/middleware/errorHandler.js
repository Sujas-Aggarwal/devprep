/**
 * middleware/errorHandler.js
 * Centralized error handling middleware.
 * Catches all errors passed via next(err) and returns structured JSON responses.
 */

function errorHandler(err, req, res, next) {
  console.error(`[ERROR] ${req.method} ${req.path} →`, err.message);

  const status = err.status || err.statusCode || 500;
  const message = status < 500 ? err.message : 'An internal server error occurred.';

  res.status(status).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}

module.exports = { errorHandler };
