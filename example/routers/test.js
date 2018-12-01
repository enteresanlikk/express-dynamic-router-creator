const example = require('./example');

module.exports={
    rootUrl: 'api',
    middleware: 'TestMid2',
    routes: [
        {
            groupUrl: 'example',
            groupRoutes: example,
            status: false
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