'use strict';

const express = require('express');
const app = express();
const path = require('path');

const DynamicRouter = require('../..');

new DynamicRouter({
  app,
  folders: {
    routers: path.join(__dirname, 'routers'),
    controllers: path.join(__dirname, 'controllers'),
    middlewares: path.join(__dirname, 'middlewares'),
  },
  routerFiles: ['api/main', 'client'],
}).run();

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
