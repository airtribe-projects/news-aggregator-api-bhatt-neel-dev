const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const preferencesController = require('../controllers/preferencesController');
const validate = require('../middlewares/validate');
const authenticateToken = require('../middlewares/auth');
const { signupSchema, loginSchema } = require('../validators/authValidator');
const { updatePreferencesSchema } = require('../validators/preferencesValidator');

router.post('/signup', validate(signupSchema), authController.signup);
router.post('/login', validate(loginSchema), authController.login);

router.get('/preferences', authenticateToken, preferencesController.getPreferences);
router.put('/preferences', authenticateToken, validate(updatePreferencesSchema), preferencesController.updatePreferences);

module.exports = router;