const example=require('./example');

module.exports={
    rootUrl:'api',
    version:{
        text:'v',
        number:1
    },
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