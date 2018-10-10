const example = require('./example');

module.exports={
    rootUrl: 'api',
    middleware: 'TestMid2',
    routes: [
        {
            groupUrl: 'example',
            middleware: 'TestMid2',
            groupRoutes: example
        },
        {
            method: 'GET',
            url: '',
            controller: 'IndexController',
            action: 'Index',
            middleware: ['TestMid1', 'TestMid2']
        }
    ]
};