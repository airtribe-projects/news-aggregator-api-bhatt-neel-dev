const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');
const authenticateToken = require('../middlewares/auth');

router.get('/', authenticateToken, newsController.getNews);

module.exports = router;