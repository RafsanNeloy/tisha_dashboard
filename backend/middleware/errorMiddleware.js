const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;

  res.status(statusCode);

  // Format mongoose validation errors
  if (err.name === 'ValidationError') {
    const validationErrors = Object.values(err.errors).map(error => error.message);
    return res.json({
      message: 'Validation Error',
      errors: validationErrors,
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
  }

  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = {
  errorHandler,
}; 