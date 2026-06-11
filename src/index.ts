import express from 'express';

import { errorHandler, notFoundHandler } from './middleware/error.js';
import { logger } from './middleware/logger.js';
import { router } from './routes/index.js';

const app = express();
const port = 3000;

app.use(express.json());

app.use(logger);

app.use(router);

app.get('/test-error', (req, res) => {
  void req;
  void res;

  throw new Error('Test error');
});

app.use(notFoundHandler);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
