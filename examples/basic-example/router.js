'use strict';

module.exports = [
  {
    url: 'api',
    method: 'get',
    routes: [
      {
        url: 'users',
        routes: [
          {
            action: (req, res) => {
              res.send('user list');
            },
          },
          {
            method: 'post',
            action: (req, res) => {
              res.send('add user');
            },
          },
          {
            url: ':id',
            routes: [
              {
                method: 'put',
                action: (req, res) => {
                  res.send('update user');
                },
              },
              {
                method: 'delete',
                action: (req, res) => {
                  res.send('delete user');
                },
              },
              {
                action: (req, res) => {
                  res.send('user detail');
                },
              },
            ],
          },
        ],
      },
    ],
  },
];
