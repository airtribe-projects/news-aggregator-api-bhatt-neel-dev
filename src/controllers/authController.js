const authService = require('../services/authService');

class AuthController {
  async signup(req, res, next) {
    try {
      const user = await authService.signup(req.validatedBody);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const result = await authService.login(
        req.validatedBody.email,
        req.validatedBody.password
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();