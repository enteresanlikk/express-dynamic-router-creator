const cors = require('cors');

const example=require('./example');

const WhiteList = ['http://localhost:3030'];
var corsOptions = {
    origin: function (origin, callback) {
        if ( WhiteList.indexOf(origin) !== -1 || !origin ) {
            callback(null, true)
        } else {
            callback({
                status:403,
                data: 'No Access!'
            });
        }
    },
    optionsSuccessStatus: 200,
    credentials: true
}

module.exports={
    rootUrl: 'api',
    version: {
        text: 'v',
        number: 1
    },
    optionsMiddleware: cors(corsOptions),
    middleware: 'TestMid1',
    routes: [
        {
            method: 'GET',
            url: 'home',
            controller: 'IndexController',
            action: 'Index'
        },
        {
            groupUrl: 'example',
            middleware: ['TestMid1', 'TestMid2'],
            groupRoutes: example
        }
    ]
};