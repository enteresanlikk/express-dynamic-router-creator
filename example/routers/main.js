const cors = require('cors');

const WhiteList = ['http://localhost:3030'];
var corsOptions = {
    origin: function (origin, callback) {
        if ( WhiteList.indexOf(origin) !== -1 || !origin ) {
            callback(null, true)
        } else {
            callback({
                status: 403,
                data: 'You do not have permission!'
            });
        }
    },
    optionsSuccessStatus: 200,
    credentials: true
}

module.exports= [
    {
        OptionsMiddlewares: [cors(corsOptions)],
        Middlewares: ['TestMid1'],
        Routes: [
            {
                Method: 'POST',
                Controller: 'IndexController',
                Action: 'Index'
            },
            {
                Url: 'example-1',
                Method: 'GET',
                Routes: [
                    {
                        Method: 'GET',
                        Url: 'home',
                        Controller: 'IndexController',
                        Action: 'Index'
                    },
                    {
                        Url: 'example-2',
                        Middlewares: ['TestMid1'],
                        Method: 'PUT',
                        Routes: [
                            {
                                Url: 'home-2',
                                Controller: 'IndexController',
                                Action: 'Index',
                                Method: 'DELETE',
                                Middlewares: ['TestMid1']
                            },
                            {
                                Url: 'example-3',
                                Middlewares: ['TestMid2'],
                                Routes: [
                                    {
                                        Url: 'home-2',
                                        Controller: 'IndexController',
                                        Action: 'Index',
                                        Middlewares: ['TestMid1']
                                    },
                                    {
                                        Url: 'example-4',
                                        Routes: [
                                            {
                                                Method: 'GET',
                                                Url: 'bilal-burada',
                                                Controller: 'IndexController',
                                                Action: 'Index'
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        Url: 'home-3',
                        Controller: 'IndexController',
                        Action: 'Index'
                    }
                ]
            }
        ]
    }
];