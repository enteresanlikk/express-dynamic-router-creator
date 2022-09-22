module.exports = [
  {
    url: 'users',
    middlewares: ['auth.middleware'],
    controller: 'users.controller',
    routes: [
      {
        action: 'getAll',
      },
      {
        method: 'post',
        action: 'add',
      },
      {
        url: ':id',
        routes: [
          {
            method: 'put',
            action: 'update',
          },
          {
            method: 'delete',
            action: 'delete',
          },
          {
            action: 'get',
          },
        ],
      },
    ],
  },
];
