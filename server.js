const app = require('./app');
const config = require('./src/config');

const port = config.port;

app.listen(port, (err) => {
  if (err) {
    return console.log('Something bad happened', err);
  }
  console.log(`Server is listening on ${port}`);
});