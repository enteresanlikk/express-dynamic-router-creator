'use strict';
const express = require('express');
const app = express();

const DynamicRouter = require('../..');

new DynamicRouter({
  app,
  port: process.env.PORT || 3000,
  routers: [
    {
      url: 'api',
      method: 'get',
      middlewares: [
        (req, res, next) => {
          res.setHeader('x-app', 'express-dynamic-router-creator');
          next();
        }
      ],
      routes: [
        {
          url: 'users',
          routes: [
            {
              action: (req, res) => {
                res.send('user list');
              },
            },
          ],
        },
      ],
    },
  ],
}).run();
