const eventRegistry = require('../config/newsApi');
const { QueryArticles, RequestArticlesInfo, ReturnInfo } = require('eventregistry');
const cache = require('../utils/cache');

class NewsService {
  normalizeArticle(article) {
    return {
      title: article.title || '',
      description: article.body || article.description || '',
      url: article.url || '',
      imageUrl: article.image || '',
      source: article.source?.title || article.source?.uri || '',
      publishedAt: article.dateTime || article.date || ''
    };
  }

  async getNews(preferences) {
    const cacheKey = { preferences };
    const cachedNews = cache.get(cacheKey);

    if (cachedNews) {
      return cachedNews;
    }

    try {
      const keywords = preferences.length > 0 ? preferences.join(' OR ') : 'technology';

      const query = new QueryArticles({
        keywords: keywords,
        lang: 'eng'
      });

      query.setRequestedResult(new RequestArticlesInfo({
        page: 1,
        count: 10,
        sortBy: 'date',
        sortByAsc: false
      }));

      const response = await eventRegistry.execQuery(query);

      const articles = response?.articles?.results || [];
      const normalizedNews = articles.map(article => this.normalizeArticle(article));

      const result = { news: normalizedNews };
      cache.set(cacheKey, result);

      return result;
    } catch (error) {
      console.error('EventRegistry API Error:', error.message);
      throw new Error('Failed to fetch news from EventRegistry');
    }
  }
}

module.exports = new NewsService();