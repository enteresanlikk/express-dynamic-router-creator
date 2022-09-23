'use strict';

const express = require('express');
const path = require('path');

const app = express();
const DynamicRouter = require('../..');

new DynamicRouter({
  app: app,
  port: process.env.PORT || 3000,
  folders: {
    routers: path.join(__dirname, 'routers'),
    controllers: path.join(__dirname, 'controllers'),
    middlewares: path.join(__dirname, 'middlewares'),
  },
  routerFiles: ['api/main', 'client'],
}).run();
