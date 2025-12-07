const { EventRegistry } = require('eventregistry');
const config = require('./index');

const eventRegistry = new EventRegistry({
  apiKey: config.newsApi.key
});

module.exports = eventRegistry;