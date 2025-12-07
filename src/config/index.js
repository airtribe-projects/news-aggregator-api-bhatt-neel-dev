require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  jwt: {
    secret: process.env.JWT_SECRET || 'default-secret-key',
    expiry: process.env.JWT_EXPIRY || '24h'
  },
  newsApi: {
    key: process.env.NEWS_API_KEY,
    baseUrl: process.env.NEWS_API_BASE_URL || 'https://eventregistry.org'
  },
  cache: {
    ttl: parseInt(process.env.CACHE_TTL) || 300000
  }
};