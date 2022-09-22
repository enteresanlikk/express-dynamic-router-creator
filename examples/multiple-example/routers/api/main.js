'use strict';
const cors = require('cors');

const v1Routes = require('./v1');
const v2Routes = require('./v2');

const whiteList = ['http://localhost:3000', 'http://127.0.0.1:5500'];
var corsOptions = {
  origin: function (origin, callback) {
    if (whiteList.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(`${origin} Not allowed by CORS`, false);
    }
  },
  optionsSuccessStatus: 200,
};

module.exports = [
  {
    url: 'api',
    method: 'get',
    middlewares: [
      cors(corsOptions),
      (req, res, next) => {
        res.setHeader('npm-module', 'express dynamic router creator');
        next();
      },
    ],
    routes: [
      {
        url: 'v1',
        routes: v1Routes,
      },
      {
        url: 'v2',
        routes: v2Routes,
      },
    ],
  },
];
