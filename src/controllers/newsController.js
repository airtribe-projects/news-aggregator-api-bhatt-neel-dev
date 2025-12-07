const newsService = require('../services/newsService');

class NewsController {
  async getNews(req, res, next) {
    try {
      const preferences = req.user.preferences || [];
      const news = await newsService.getNews(preferences);
      res.status(200).json(news);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new NewsController();