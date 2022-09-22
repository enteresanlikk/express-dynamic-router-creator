module.exports = [
  {
    url: 'users',
    middlewares: ['auth.middleware'],
    controller: 'users.controller',
    routes: [
      {
        url: 'profile',
        action: 'getProfile',
      },
      {
        url: 'logout',
        action: (req, res) => {
          res.send('logout');
        }
      }
    ]
  },
];
