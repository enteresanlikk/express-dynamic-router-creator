module.exports= [
    {
        Url: 'client',
        Middlewares: ['TestMid1'],
        Routes: [
            {
                Method: 'GET',
                Url: 'home',
                Controller: 'IndexController',
                Action: 'Index'
            },
            {
                Url: 'example',
                Middlewares: ['TestMid1', 'TestMid2'],
                Routes: [
                    {
                        Method: 'PUT',
                        Url: 'home',
                        Controller: 'IndexController',
                        Action: 'Index'
                    },
                    {
                        Url: 'example',
                        Middlewares: ['TestMid1', 'TestMid2'],
                        Method: 'POST',
                        Routes: [
                            {
                                Url: 'home-2',
                                Controller: 'IndexController',
                                Action: 'Index',
                                Middlewares: ['TestMid1']
                            }
                        ]
                    },
                    {
                        Method: 'DELETE',
                        Url: 'home-3',
                        Controller: 'IndexController',
                        Action: 'Index',
                        Middlewares: ['TestMid1']
                    }
                ]
            }
        ]
    }
];