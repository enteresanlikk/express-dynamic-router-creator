import example from './example';

module.exports={
    rootUrl:'api',
    middleware:'SetHeader',
    routes:[
        {
            groupUrl:'example',
            groupRoutes:example
        },
        {
            method:'GET',
            url:'',
            controller:'IndexController',
            action:'Index',
            middleware:['TestMid1','TestMid2'] // or 'TestMid1'
        }
    ]
};