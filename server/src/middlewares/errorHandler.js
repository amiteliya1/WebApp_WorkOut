export const errorHandler = (err, req, res, next) => {
  // 5) If this is a static file 404, return 404, not 500
  if (req.path.startsWith('/assets') || req.path.match(/\.(js|css|svg|png|jpg|jpeg|gif|ico|woff|woff2|ttf|eot)$/)) {
    if (err.status === 404 || err.statusCode === 404 || err.code === 'ENOENT') {
      return res.status(404).end(); // Return 404, not 500
    }
  }
  
  let statusCode = err.statusCode || err.status || 500;
  let message = err.message || 'Internal Server Error';

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    const errors = Object.values(err.errors).map((e) => e.message);
    message = errors.join(', ');
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 404;
    message = 'Workout not found';
  }

  // Duplicate key error
  if (err.code === 11000) {
    statusCode = 400;
    message = 'Duplicate entry';
  }

  // Only send JSON if headers haven't been sent
  if (!res.headersSent) {
    res.status(statusCode).json({
      success: false,
      error: message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
  }
};

export const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    error: `Not Found - ${req.originalUrl}`,
  });
};

