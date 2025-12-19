import http from 'node:http';
import { app } from './app.js';
import { env } from './config/env.js';
import { connectToMongo } from './config/db.js';

await connectToMongo();

const server = http.createServer(app);

server.listen(env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`API listening on port ${env.PORT}`);
});
