const { config, validateConfig } = require('./config');
const db = require('./db');
const app = require('./app');

async function start() {
  validateConfig();
  const server = app.listen(config.port, () => {
    console.log(`DU Lost & Found is listening at ${config.appOrigin}`);
  });
  try {
    await db.query('SELECT 1');
    await app.locals.expireItems();
  } catch (error) {
    // Keep the static client available during database outages so users see
    // the app's connection error instead of a browser connection failure.
    console.error('Database is unavailable; API requests may fail:', error.message);
  }
  const expiryTimer = setInterval(() => {
    app.locals.expireItems().catch(error => console.error('Unable to archive expired items:', error.message));
  }, 60 * 60 * 1000);
  expiryTimer.unref();

  const shutdown = async signal => {
    console.info(`Received ${signal}; closing server`);
    clearInterval(expiryTimer);
    server.close(async error => {
      if (error) {
        console.error(error);
        process.exitCode = 1;
      }
      await db.end();
    });
  };
  process.once('SIGINT', () => shutdown('SIGINT'));
  process.once('SIGTERM', () => shutdown('SIGTERM'));
}

start().catch(error => {
  console.error('Unable to start DU Lost & Found:', error.message);
  process.exitCode = 1;
});
