const errorHandler = (err, req, res, next) => {
  if (err.message === 'User with this email already exists') {
    return res.status(409).json({ message: err.message });
  }

  if (err.message === 'Invalid credentials') {
    return res.status(401).json({ message: err.message });
  }

  if (err.message === 'User not found') {
    return res.status(404).json({ message: err.message });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: err.message });
  }

  return res.status(500).json({
    message: err.message || 'Internal server error'
  });
};

module.exports = errorHandler;