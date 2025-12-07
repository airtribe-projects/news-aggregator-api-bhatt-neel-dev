const Joi = require('joi');

const updatePreferencesSchema = Joi.object({
  preferences: Joi.array().items(Joi.string()).required()
});

module.exports = {
  updatePreferencesSchema
};