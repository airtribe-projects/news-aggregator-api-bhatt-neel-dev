const preferencesService = require('../services/preferencesService');

class PreferencesController {
  async getPreferences(req, res, next) {
    try {
      const preferences = preferencesService.getPreferences(req.user.id);
      res.status(200).json(preferences);
    } catch (error) {
      next(error);
    }
  }

  async updatePreferences(req, res, next) {
    try {
      const preferences = preferencesService.updatePreferences(
        req.user.id,
        req.validatedBody.preferences
      );
      res.status(200).json(preferences);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PreferencesController();