module.exports=[
    {
        method: 'GET',
        url: 'home',
        controller: 'IndexController',
        action: 'Index'
    },
    {
        method: 'GET',
        url: 'home-2',
        controller: 'IndexController',
        action: 'Index',
        middleware: 'TestMid1'
    },
    {
        method: 'GET',
        url: 'home-3',
        controller: 'IndexController',
        action: 'Index',
        middleware: 'TestMid1'
    }
];