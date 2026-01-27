export const errorHandler = (err, req, res, next) => {
  // 2) If req.path starts with '/assets':
  //    - DO NOT send res.status(500)
  //    - DO NOT modify the response
  //    - Just call next(err) - Express default handler will send 500, but we prevent that
  if (req.path.startsWith('/assets')) {
    // Only return 500 for non-static routes
    // For /assets, don't send any response - let express.static handle it naturally
    // If headers already sent, do nothing
    if (res.headersSent) {
      return;
    }
    // For /assets errors, return 404 instead of 500
    // express.static should have already handled 404 cases, but if we get here,
    // it means there was an actual error (not just file not found)
    // Return 404 to match express.static behavior
    return res.status(404).end();
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
  // For /assets, let express.static handle 404 naturally
  if (req.path.startsWith('/assets')) {
    // express.static will return 404 if file not found
    // Don't override it with JSON response
    return res.status(404).end();
  }
  
  res.status(404).json({
    success: false,
    error: `Not Found - ${req.originalUrl}`,
  });
};
