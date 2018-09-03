const example=require('./example');

const WhiteList=YOUR_WHITE_LIST;
var corsOptions = {
    origin: function (origin, callback) {
        if (WhiteList.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback({status:403,data:'No Access!'});
        }
    },
    optionsSuccessStatus: 200,
    methods:'OPTIONS',
    credentials:true
}

module.exports={
    rootUrl:'api',
    version:{
        text:'v',
        number:1
    },
    optionsMiddleware:cors(corsOptions),
    middleware:'SetHeader',
    routes:[
        {
            method:'GET',
            url:'home',
            controller:'IndexController',
            action:'Index'
        },
        {
            groupUrl:'example',
            middleware:['TestMid1','TestMid2'],
            groupRoutes:example
        }
    ]
};