const config = require('../config');

class Cache {
  constructor() {
    this.cache = new Map();
  }

  generateKey(data) {
    return JSON.stringify(data);
  }

  set(key, value) {
    const cacheKey = typeof key === 'string' ? key : this.generateKey(key);
    const expiresAt = Date.now() + config.cache.ttl;
    this.cache.set(cacheKey, { value, expiresAt });
  }

  get(key) {
    const cacheKey = typeof key === 'string' ? key : this.generateKey(key);
    const cached = this.cache.get(cacheKey);

    if (!cached) {
      return null;
    }

    if (Date.now() > cached.expiresAt) {
      this.cache.delete(cacheKey);
      return null;
    }

    return cached.value;
  }

  clear() {
    this.cache.clear();
  }

  delete(key) {
    const cacheKey = typeof key === 'string' ? key : this.generateKey(key);
    return this.cache.delete(cacheKey);
  }
}

module.exports = new Cache();