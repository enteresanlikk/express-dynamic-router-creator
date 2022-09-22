'use strict';

const express = require('express');
const app = express();
const path = require('path');

const DynamicRouter = require('../..');

new DynamicRouter({
  app,
  folders: {
    routers: path.join(__dirname),
  },
  routerFiles: ['router'],
}).run();

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
