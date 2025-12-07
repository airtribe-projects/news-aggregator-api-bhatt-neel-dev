const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errors = error.details.map(detail => detail.message);
      return res.status(400).json({
        message: errors.join(', ')
      });
    }

    req.validatedBody = value;
    next();
  };
};

module.exports = validate;