'use strict';
const v1Routes = require('./v1');
const v2Routes = require('./v2');

module.exports = [
  {
    url: 'api',
    method: 'get',
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
