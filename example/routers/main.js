const example=require('./example');

module.exports={
    rootUrl:'api',
    version:{
        text:'denemeversiyon',
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
            groupRoutes:example
        }
    ]
};